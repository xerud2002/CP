/**
 * Shared chat hook for managing real-time messaging
 * Used by OrderChat, CourierChatModal, and other chat components
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc,
  getDocs 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'curier';
  receiverId?: string;
  clientId?: string;
  courierId?: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  createdAt: Date;
  read?: boolean;
  readByClient?: boolean;
  readByCourier?: boolean;
}

interface UseChatMessagesOptions {
  orderId: string;
  userId: string;
  userRole: 'client' | 'curier';
  courierId?: string;
  clientId?: string;
}

/**
 * Hook for loading and marking chat messages as read
 * Handles real-time subscriptions and role-specific read tracking
 */
export function useChatMessages({ 
  orderId, 
  userId, 
  userRole, 
  courierId, 
  clientId 
}: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load messages in real-time
  useEffect(() => {
    if (!orderId || !userId) return;

    const messagesRef = collection(db, 'mesaje');
    let q;

    if (userRole === 'client') {
      // Client sees messages for this order and clientId
      if (courierId) {
        q = query(
          messagesRef,
          where('orderId', '==', orderId),
          where('clientId', '==', userId),
          where('courierId', '==', courierId),
          orderBy('createdAt', 'asc')
        );
      } else {
        // No courier assigned yet - show messages from ANY courier
        q = query(
          messagesRef,
          where('orderId', '==', orderId),
          where('clientId', '==', userId),
          orderBy('createdAt', 'asc')
        );
      }
    } else {
      // Courier sees messages between them and the client
      const effectiveCourierId = courierId || userId;
      
      if (!clientId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      
      q = query(
        messagesRef,
        where('orderId', '==', orderId),
        where('clientId', '==', clientId),
        where('courierId', '==', effectiveCourierId),
        orderBy('createdAt', 'asc')
      );
    }

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const loadedMessages: ChatMessage[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as ChatMessage));
        
        setMessages(loadedMessages);
        setLoading(false);
      },
      (error) => {
        logError(error, 'Error loading messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, userId, userRole, courierId, clientId]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!orderId || !userId) return;

    try {
      const messagesRef = collection(db, 'mesaje');
      let q;
      
      if (userRole === 'client') {
        if (courierId) {
          q = query(
            messagesRef,
            where('orderId', '==', orderId),
            where('clientId', '==', userId),
            where('courierId', '==', courierId)
          );
        } else {
          q = query(
            messagesRef,
            where('orderId', '==', orderId),
            where('clientId', '==', userId)
          );
        }
      } else {
        if (!clientId) return;
        
        q = query(
          messagesRef,
          where('orderId', '==', orderId),
          where('clientId', '==', clientId),
          where('courierId', '==', userId)
        );
      }

      const snapshot = await getDocs(q);
      
      const updatePromises = snapshot.docs
        .filter(docSnap => {
          const data = docSnap.data();
          if (data.senderId === userId) return false;
          if (userRole === 'client' && data.readByClient === true) return false;
          if (userRole !== 'client' && data.readByCourier === true) return false;
          return true;
        })
        .map(docSnap => {
          const updateData: Record<string, boolean> = { read: true };
          if (userRole === 'client') {
            updateData.readByClient = true;
          } else {
            updateData.readByCourier = true;
          }
          return updateDoc(doc(db, 'mesaje', docSnap.id), updateData);
        });
      
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    } catch (error) {
      logError(error, 'Error marking messages as read');
    }
  }, [orderId, userId, userRole, courierId, clientId]);

  // Auto-mark as read when chat opens
  useEffect(() => {
    const timer = setTimeout(() => {
      markMessagesAsRead();
    }, 500);

    return () => clearTimeout(timer);
  }, [markMessagesAsRead]);

  return {
    messages,
    loading,
    markMessagesAsRead
  };
}
