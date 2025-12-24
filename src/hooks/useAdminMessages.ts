'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'client' | 'curier';
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  participants: string[];
  message: string;
  read: boolean;
  createdAt: any;
}

export function useAdminMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'admin_messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdminMessage[];

        setMessages(loadedMessages);

        // Count unread messages that are NOT sent by current user
        const unread = loadedMessages.filter(
          msg => !msg.read && msg.senderId !== user.uid
        ).length;
        
        setUnreadCount(unread);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading admin messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { messages, unreadCount, loading };
}
