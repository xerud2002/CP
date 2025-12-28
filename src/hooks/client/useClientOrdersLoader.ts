'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/types';

interface UseClientOrdersLoaderProps {
  userId: string;
  countryFilter?: string;
  serviceFilter?: string;
  searchQuery?: string;
  sortBy?: string;
  initialExpandedOrderId?: string | null;
}

export function useClientOrdersLoader({ 
  userId, 
  countryFilter, 
  serviceFilter, 
  searchQuery,
  sortBy = 'newest',
  initialExpandedOrderId 
}: UseClientOrdersLoaderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChats, setExpandedChats] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Auto-expand chat when initialExpandedOrderId is provided
  useEffect(() => {
    if (initialExpandedOrderId && !loading && orders.length > 0) {
      const orderExists = orders.some(o => o.id === initialExpandedOrderId);
      if (orderExists) {
        setExpandedChats(new Set([initialExpandedOrderId]));
        // Scroll to the order
        setTimeout(() => {
          const orderElement = document.getElementById(`order-${initialExpandedOrderId}`);
          if (orderElement) {
            orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [initialExpandedOrderId, loading, orders]);
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
      const ordersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((order: any) => order.archived !== true) as Order[]; // Filter archived orders client-side
      
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
        where('clientId', '==', userId)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        // Count messages not sent by client and not read by client
        const unreadCount = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.senderId !== userId && data.readByClient !== true;
        }).length;
        const orderId = order.id as string;
        setUnreadCounts(prev => ({
          ...prev,
          [orderId]: unreadCount
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [userId, orders]);

  // Filter orders - normalize service names and check country, status, search
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

    // Search filter (order number, cities)
    if (searchQuery && searchQuery.trim() !== '') {
      const search = searchQuery.toLowerCase().trim();
      const orderNumber = `#cp${order.orderNumber || ''}`.toLowerCase();
      const pickupCity = (order.oras_ridicare || '').toLowerCase();
      const deliveryCity = (order.oras_livrare || '').toLowerCase();
      
      const matches = orderNumber.includes(search) || 
                     pickupCity.includes(search) || 
                     deliveryCity.includes(search);
      
      if (!matches) {
        return false;
      }
    }
    
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?.toDate?.().getTime() || 0);
    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?.toDate?.().getTime() || 0);
    
    switch (sortBy) {
      case 'oldest':
        return aTime - bTime;
      case 'newest':
      default:
        return bTime - aTime;
    }
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
    orders: sortedOrders,
    loading,
    expandedChats,
    unreadCounts,
    toggleChat
  };
}
