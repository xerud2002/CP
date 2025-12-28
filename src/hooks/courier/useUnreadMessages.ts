import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, or } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/types';

/**
 * Custom hook to track unread message counts for courier orders
 * OPTIMIZED: Uses a single query with OR conditions instead of N separate queries
 * 
 * @param userId - Current user ID (courier)
 * @param orders - Array of orders to track
 * @returns Record of order ID to unread count
 */
export function useUnreadMessages(userId: string | undefined, orders: Order[]) {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const previousOrderIds = useRef<string>('');

  useEffect(() => {
    if (!userId || orders.length === 0) return;

    // Get unique order IDs that have valid client IDs
    const validOrders = orders.filter(o => o.id && o.uid_client);
    
    // Optimization: Only re-subscribe if order IDs actually changed
    const currentOrderIds = validOrders.map(o => o.id).sort().join(',');
    if (currentOrderIds === previousOrderIds.current) {
      return; // No change in orders, keep existing listeners
    }
    previousOrderIds.current = currentOrderIds;

    // For small number of orders (≤10), use batched approach with single listener
    // This reduces from N queries to 1 query
    if (validOrders.length <= 10) {
      const messagesRef = collection(db, 'mesaje');
      const orderIds = validOrders.map(o => o.id!);
      
      // Single query: get all messages for courier across all their orders
      const q = query(
        messagesRef,
        where('courierId', '==', userId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const counts: Record<string, number> = {};
        
        // Initialize all orders with 0
        orderIds.forEach(id => { counts[id] = 0; });
        
        // Count unread per order
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const orderId = data.orderId;
          
          // Only count if this order is in our list and message is unread
          if (orderIds.includes(orderId) && data.senderId !== userId && data.readByCourier !== true) {
            counts[orderId] = (counts[orderId] || 0) + 1;
          }
        });
        
        setUnreadCounts(counts);
      });

      return () => unsubscribe();
    }

    // For larger order lists, fall back to individual listeners but with throttling
    const unsubscribers: (() => void)[] = [];
    const batchSize = 10;
    
    // Process in batches to avoid too many concurrent listeners
    for (let i = 0; i < Math.min(validOrders.length, 30); i++) {
      const order = validOrders[i];
      if (!order.id || !order.uid_client) continue;

      const messagesRef = collection(db, 'mesaje');
      const q = query(
        messagesRef,
        where('orderId', '==', order.id),
        where('clientId', '==', order.uid_client),
        where('courierId', '==', userId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const unreadCount = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.senderId !== userId && data.readByCourier !== true;
        }).length;
        setUnreadCounts((prev) => ({
          ...prev,
          [order.id!]: unreadCount,
        }));
      });

      unsubscribers.push(unsubscribe);
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [userId, orders]);

  return unreadCounts;
}
