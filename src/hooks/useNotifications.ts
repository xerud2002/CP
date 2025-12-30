'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  requestNotificationPermission,
  areNotificationsEnabled,
  areNotificationsSupported,
  onForegroundMessage
} from '@/lib/firebase-messaging';
import { showSuccess, showError, showInfo } from '@/lib/toast';

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string>;
}

interface UseNotificationsReturn {
  isSupported: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<void>;
}

export function useNotifications(userId: string | undefined): UseNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check support and current status on mount
  useEffect(() => {
    async function checkStatus() {
      const supported = await areNotificationsSupported();
      setIsSupported(supported);

      if (supported) {
        const enabled = areNotificationsEnabled();
        setIsEnabled(enabled);

        // Check if token exists in Firestore for this user
        if (userId && enabled) {
          const tokenDoc = await getDoc(doc(db, 'fcmTokens', userId));
          setIsEnabled(tokenDoc.exists());
        }
      }

      setIsLoading(false);
    }

    checkStatus();
  }, [userId]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isEnabled) return;

    const cleanup = onForegroundMessage((payload: unknown) => {
      const typedPayload = payload as NotificationPayload;
      // Show toast for foreground messages
      if (typedPayload.notification?.title) {
        showInfo(typedPayload.notification.title);
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [isEnabled]);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      showError('Trebuie să fii autentificat pentru notificări');
      return false;
    }

    setIsLoading(true);

    try {
      const token = await requestNotificationPermission();

      if (!token) {
        showError('Nu am putut activa notificările. Verifică setările browser-ului.');
        setIsLoading(false);
        return false;
      }

      // Save token to Firestore
      await setDoc(doc(db, 'fcmTokens', userId), {
        token,
        uid: userId,
        createdAt: new Date(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });

      setIsEnabled(true);
      showSuccess('Notificările au fost activate!');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      showError('Eroare la activarea notificărilor');
      setIsLoading(false);
      return false;
    }
  }, [userId]);

  const disableNotifications = useCallback(async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);

    try {
      // Remove token from Firestore
      await deleteDoc(doc(db, 'fcmTokens', userId));
      setIsEnabled(false);
      showInfo('Notificările au fost dezactivate');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      showError('Eroare la dezactivarea notificărilor');
    }

    setIsLoading(false);
  }, [userId]);

  return {
    isSupported,
    isEnabled,
    isLoading,
    enableNotifications,
    disableNotifications
  };
}
