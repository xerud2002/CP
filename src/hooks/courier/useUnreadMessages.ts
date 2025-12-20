import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/types';

/**
 * Custom hook to track unread message counts for courier orders
 * Sets up real-time listeners for each order's messages
 * 
 * @param userId - Current user ID (courier)
 * @param orders - Array of orders to track
 * @returns Record of order ID to unread count
 */
export function useUnreadMessages(userId: string | undefined, orders: Order[]) {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!userId || orders.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    orders.forEach((order) => {
      if (!order.id || !order.uid_client) return;

      const messagesRef = collection(db, 'mesaje');
      const q = query(
        messagesRef,
        where('orderId', '==', order.id),
        where('clientId', '==', order.uid_client),
        where('courierId', '==', userId),
        where('read', '==', false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Filter out messages sent by current user (client-side filtering)
        const unreadCount = snapshot.docs.filter(doc => doc.data().senderId !== userId).length;
        setUnreadCounts((prev) => ({
          ...prev,
          [order.id!]: unreadCount,
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [userId, orders]);

  return unreadCounts;
}
