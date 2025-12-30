import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import app from './firebase';

// VAPID key from Firebase Console
const VAPID_KEY = 'BJktvHUoixcedi9A2QdNhRfOw5n4djYRbPPoP6CsVqve-dmIjiNVGwjwJvPGcWYwjxtqBAcyIGuxNq3BW-PsZiI';

let messaging: Messaging | null = null;

// Initialize messaging only on client side and if supported
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  
  const supported = await isSupported();
  if (!supported) {
    console.log('Firebase Messaging not supported in this browser');
    return null;
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}

// Register service worker and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    // Get messaging instance
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return null;

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback: (payload: unknown) => void): (() => void) | null {
  if (typeof window === 'undefined') return null;

  getMessagingInstance().then((messagingInstance) => {
    if (messagingInstance) {
      onMessage(messagingInstance, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
      });
    }
  });

  // Return cleanup function (onMessage doesn't return unsubscribe in v9+)
  return () => {};
}

// Check if notifications are enabled
export function areNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

// Check if notifications are supported
export async function areNotificationsSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (!('serviceWorker' in navigator)) return false;
  
  return await isSupported();
}
