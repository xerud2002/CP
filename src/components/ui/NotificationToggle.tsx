'use client';

import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError, showInfo } from '@/lib/toast';

// Bell Icon SVG
const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

// Bell Slash Icon SVG
const BellSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
  </svg>
);

// Error Boundary for the notification toggle
class NotificationErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400">
          <BellSlashIcon className="w-5 h-5" />
          <span className="text-sm">Notificările nu sunt disponibile</span>
        </div>
      );
    }
    return this.props.children;
  }
}

interface NotificationToggleProps {
  userId: string | undefined;
  className?: string;
}

// Inline the notification logic to avoid import issues
function NotificationToggleInner({ userId, className = '' }: NotificationToggleProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check support on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        // Basic browser checks first
        if (typeof window === 'undefined') {
          setIsSupported(false);
          setIsLoading(false);
          return;
        }

        if (!('Notification' in window)) {
          setIsSupported(false);
          setIsLoading(false);
          return;
        }

        if (!('serviceWorker' in navigator)) {
          setIsSupported(false);
          setIsLoading(false);
          return;
        }

        // Dynamic import Firebase messaging to avoid SSR issues
        const { isSupported: checkFirebaseSupport } = await import('firebase/messaging');
        const supported = await checkFirebaseSupport();
        setIsSupported(supported);

        if (supported && userId) {
          // Check if user has notifications enabled
          const permission = Notification.permission;
          if (permission === 'granted') {
            const tokenDoc = await getDoc(doc(db, 'fcmTokens', userId));
            setIsEnabled(tokenDoc.exists());
          }
        }
      } catch (err) {
        console.error('Error checking notification support:', err);
        setIsSupported(false);
        setError('Eroare la verificare');
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, [userId]);

  const enableNotifications = useCallback(async () => {
    if (!userId) {
      showError('Trebuie să fii autentificat pentru notificări');
      return;
    }

    setIsLoading(true);
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showError('Permisiunea pentru notificări a fost refuzată');
        setIsLoading(false);
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      // Get Firebase messaging
      const { getMessaging, getToken } = await import('firebase/messaging');
      const { default: app } = await import('@/lib/firebase');
      const messaging = getMessaging(app);
      
      // Get token
      const VAPID_KEY = 'BJktvHUoixcedi9A2QdNhRfOw5n4djYRbPPoP6CsVqve-dmIjiNVGwjwJvPGcWYwjxtqBAcyIGuxNq3BW-PsZiI';
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        // Save token to Firestore
        await setDoc(doc(db, 'fcmTokens', userId), {
          token,
          userId,
          createdAt: new Date(),
          platform: 'web',
          userAgent: navigator.userAgent
        });
        setIsEnabled(true);
        showSuccess('Notificările au fost activate!');
      } else {
        showError('Nu s-a putut obține token-ul pentru notificări');
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      showError('Eroare la activarea notificărilor');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const disableNotifications = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'fcmTokens', userId));
      setIsEnabled(false);
      showInfo('Notificările au fost dezactivate');
    } catch (err) {
      console.error('Error disabling notifications:', err);
      showError('Eroare la dezactivarea notificărilor');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 ${className}`}>
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Se verifică...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 ${className}`}>
        <BellSlashIcon className="w-5 h-5" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  // Show not supported message
  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 ${className}`}>
        <BellSlashIcon className="w-5 h-5" />
        <span className="text-sm">Notificările nu sunt disponibile în acest browser</span>
      </div>
    );
  }

  const handleToggle = async () => {
    if (isEnabled) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isEnabled
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isEnabled ? 'Dezactivează notificările' : 'Activează notificările'}
    >
      {isEnabled ? (
        <BellIcon className="w-5 h-5" />
      ) : (
        <BellSlashIcon className="w-5 h-5" />
      )}
      <span className="text-sm">
        {isEnabled ? 'Notificări active' : 'Activează notificări'}
      </span>
    </button>
  );
}

// Export wrapped component with error boundary
export function NotificationToggle(props: NotificationToggleProps) {
  return (
    <NotificationErrorBoundary>
      <NotificationToggleInner {...props} />
    </NotificationErrorBoundary>
  );
}
