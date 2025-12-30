import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

interface OrderData {
  uid_client: string;
  serviciu: string;
  locatie_ridicare_tara: string;
  locatie_ridicare_judet: string;
  locatie_ridicare_oras: string;
  locatie_livrare_tara: string;
  locatie_livrare_judet: string;
  locatie_livrare_oras: string;
  orderNumber: string;
  status: string;
}

interface MessageData {
  orderId: string;
  clientId: string;
  courierId: string;
  senderId: string;
  senderRole: "client" | "curier" | "admin";
  text: string;
  timestamp: admin.firestore.Timestamp;
}

interface FCMTokenData {
  token: string;
  uid: string;
}

interface CoverageZone {
  uid: string;
  tara: string;
  judet: string;
  oras: string;
}

// Helper to send notification
async function sendNotification(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string>
): Promise<void> {
  try {
    const tokenDoc = await db.collection("fcmTokens").doc(userId).get();

    if (!tokenDoc.exists) {
      console.log(`No FCM token for user ${userId}`);
      return;
    }

    const tokenData = tokenDoc.data() as FCMTokenData;

    const message = {
      notification: {
        title,
        body,
      },
      data,
      token: tokenData.token,
    };

    await messaging.send(message);
    console.log(`Notification sent to ${userId}`);
  } catch (error) {
    console.error(`Error sending notification to ${userId}:`, error);

    // Remove invalid token
    if (
      error instanceof Error &&
      (error.message.includes("registration-token-not-registered") ||
        error.message.includes("invalid-registration-token"))
    ) {
      await db.collection("fcmTokens").doc(userId).delete();
      console.log(`Removed invalid token for ${userId}`);
    }
  }
}

// Trigger: New order created - notify matching couriers
export const onNewOrder = onDocumentCreated(
  "comenzi/{orderId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const orderData = snapshot.data() as OrderData;
    const orderId = event.params.orderId;

    console.log(`New order created: ${orderId}`);

    // Find couriers with matching coverage zones
    const coverageQuery = await db
      .collection("zona_acoperire")
      .where("tara", "==", orderData.locatie_ridicare_tara)
      .get();

    const matchingCourierIds = new Set<string>();

    coverageQuery.forEach((doc) => {
      const zone = doc.data() as CoverageZone;
      // Check if zone matches (country level, or more specific)
      if (
        zone.tara === orderData.locatie_ridicare_tara ||
        zone.tara === orderData.locatie_livrare_tara
      ) {
        matchingCourierIds.add(zone.uid);
      }
    });

    console.log(`Found ${matchingCourierIds.size} matching couriers`);

    // Send notifications to matching couriers
    const notifications = Array.from(matchingCourierIds).map((courierId) =>
      sendNotification(
        courierId,
        "Comandă nouă disponibilă! 📦",
        `${orderData.serviciu}: ${orderData.locatie_ridicare_oras || orderData.locatie_ridicare_judet} → ` +
          `${orderData.locatie_livrare_oras || orderData.locatie_livrare_judet}`,
        {
          type: "new_order",
          orderId,
          url: `/dashboard/curier/comenzi`,
        }
      )
    );

    await Promise.all(notifications);
  }
);

// Trigger: New message - notify recipient
export const onNewMessage = onDocumentCreated(
  "mesaje/{messageId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const messageData = snapshot.data() as MessageData;

    // Determine recipient (opposite of sender)
    let recipientId: string;
    let senderName: string;

    if (messageData.senderRole === "client") {
      recipientId = messageData.courierId;
      senderName = "un client";
    } else if (messageData.senderRole === "curier") {
      recipientId = messageData.clientId;
      senderName = "un curier";
    } else {
      // Admin message
      recipientId =
        messageData.senderId === messageData.clientId ?
          messageData.courierId :
          messageData.clientId;
      senderName = "Curierul Perfect";
    }

    // Don't notify yourself
    if (recipientId === messageData.senderId) return;

    await sendNotification(
      recipientId,
      `Mesaj nou de la ${senderName} 💬`,
      messageData.text.substring(0, 100) +
        (messageData.text.length > 100 ? "..." : ""),
      {
        type: "new_message",
        orderId: messageData.orderId,
        url:
          messageData.senderRole === "client" ?
            `/dashboard/curier/comenzi` :
            `/dashboard/client/comenzi`,
      }
    );
  }
);

// Trigger: Admin message to user
export const onAdminMessage = onDocumentCreated(
  "admin_messages/{messageId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const messageData = snapshot.data() as {
      recipientId: string;
      subject: string;
      message: string;
    };

    await sendNotification(
      messageData.recipientId,
      "Mesaj de la Curierul Perfect 📧",
      messageData.subject || messageData.message.substring(0, 100),
      {
        type: "admin_message",
        url: "/dashboard/client/suport",
      }
    );
  }
);

// HTTP function to test notifications
export const testNotification = functions.https.onRequest(async (req, res) => {
  const {userId, title, body} = req.query;

  if (!userId || !title || !body) {
    res.status(400).send("Missing userId, title, or body");
    return;
  }

  await sendNotification(
    userId as string,
    title as string,
    body as string,
    {type: "test"}
  );

  res.send("Notification sent!");
});
