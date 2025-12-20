'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/types';

interface UseClientOrdersLoaderProps {
  userId: string;
  countryFilter?: string;
  serviceFilter?: string;
}

export function useClientOrdersLoader({ userId, countryFilter, serviceFilter }: UseClientOrdersLoaderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChats, setExpandedChats] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Load orders
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const q = query(
      collection(db, 'comenzi'),
      where('uid_client', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Track unread messages
  useEffect(() => {
    if (!userId || orders.length === 0) return;

    const unsubscribes: Array<() => void> = [];

    orders.forEach(order => {
      if (!order.id) return;
      
      const messagesQuery = query(
        collection(db, 'mesaje'),
        where('orderId', '==', order.id),
        where('clientId', '==', userId),
        where('senderId', '!=', userId)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const unreadMessages = snapshot.docs.filter(doc => !doc.data().readByClient);
        const orderId = order.id as string;
        setUnreadCounts(prev => ({
          ...prev,
          [orderId]: unreadMessages.length
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [userId, orders]);

  // Filter orders - normalize service names and check country
  const filteredOrders = orders.filter(order => {
    // Country filter (checks both expeditor and destinatar)
    if (countryFilter && countryFilter !== 'all') {
      const selectedCountryCode = countryFilter.toLowerCase();
      const orderExpeditorCode = (order.expeditorTara || order.tara_ridicare || '').toLowerCase().trim();
      const orderDestinatarCode = (order.destinatarTara || order.tara_livrare || '').toLowerCase().trim();
      
      // Check if either expeditor or destinatar country matches
      if (orderExpeditorCode !== selectedCountryCode && orderDestinatarCode !== selectedCountryCode) {
        return false;
      }
    }
    
    // Service filter
    if (serviceFilter && serviceFilter !== 'all') {
      const normalizedServiceFilter = serviceFilter.toLowerCase().trim();
      const normalizedOrderService = (order.serviciu || '').toLowerCase().trim();
      
      if (normalizedOrderService !== normalizedServiceFilter) {
        return false;
      }
    }
    
    return true;
  });

  // Toggle chat expansion
  const toggleChat = useCallback((orderId: string) => {
    setExpandedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  return {
    orders: filteredOrders,
    loading,
    expandedChats,
    unreadCounts,
    toggleChat
  };
}
