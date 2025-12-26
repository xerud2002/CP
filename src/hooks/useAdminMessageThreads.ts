'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface MessageThread {
  userId: string;
  userName: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface MessageData {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  senderRole: string;
  receiverRole: string;
  createdAt?: Timestamp;
  read: boolean;
  message: string;
}

export function useAdminMessageThreads() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const loadThreads = async () => {
      try {
        // Get all messages involving admin
        const q = query(
          collection(db, 'admin_messages'),
          where('participants', 'array-contains', user.uid)
        );

        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MessageData[];

        // Group by user
        const userThreadsMap = new Map<string, MessageThread>();
        const userUnreadCounts = new Map<string, number>();

        messages.forEach((msg) => {
          // Find the other user (not admin)
          const otherUserId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
          const otherUserName = msg.senderId === user.uid ? msg.receiverName : msg.senderName;
          const otherUserRole = msg.senderId === user.uid ? msg.receiverRole : msg.senderRole;

          const existing = userThreadsMap.get(otherUserId);
          const messageTime = msg.createdAt?.toDate?.() || new Date();

          // Count unread messages (sent by other user, not read by admin)
          const isUnread = !msg.read && msg.senderId === otherUserId;
          if (isUnread) {
            userUnreadCounts.set(otherUserId, (userUnreadCounts.get(otherUserId) || 0) + 1);
          }

          // Keep the most recent message for this user
          if (!existing || messageTime > existing.lastMessageTime) {
            userThreadsMap.set(otherUserId, {
              userId: otherUserId,
              userName: otherUserName || 'Utilizator',
              userRole: otherUserRole || 'client',
              lastMessage: msg.message || '',
              lastMessageTime: messageTime,
              unreadCount: 0 // Will be set after loop
            });
          }
        });

        // Set unread counts for each thread
        userThreadsMap.forEach((thread, userId) => {
          thread.unreadCount = userUnreadCounts.get(userId) || 0;
        });

        // Calculate total unread
        let unreadTotal = 0;
        userUnreadCounts.forEach(count => {
          unreadTotal += count;
        });

        // Convert to array and sort by last message time
        const threadsArray = Array.from(userThreadsMap.values())
          .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

        setThreads(threadsArray);
        setTotalUnread(unreadTotal);
        setLoading(false);
      } catch (error) {
        console.error('Error loading message threads:', error);
        setLoading(false);
      }
    };

    loadThreads();

    // Reload every 10 seconds to catch new messages
    const interval = setInterval(loadThreads, 10000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  return { threads, totalUnread, loading };
}
