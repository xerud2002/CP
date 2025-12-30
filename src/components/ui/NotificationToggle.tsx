'use client';

import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError, showInfo, showWarning } from '@/lib/toast';

// ===========================================
// Platform Detection Utilities
// ===========================================

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isPWA: boolean;
  isMobile: boolean;
  supportsNotifications: boolean;
  supportsServiceWorker: boolean;
  supportsPush: boolean;
}

function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isSafari: false,
      isChrome: false,
      isFirefox: false,
      isPWA: false,
      isMobile: false,
      supportsNotifications: false,
      supportsServiceWorker: false,
      supportsPush: false,
    };
  }

  const ua = navigator.userAgent;
  
  // Platform detection
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isMobile = /Mobi|Android/i.test(ua) || isIOS;
  
  // PWA detection (standalone mode)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
                document.referrer.includes('android-app://');
  
  // Feature detection
  const supportsNotifications = 'Notification' in window;
  const supportsServiceWorker = 'serviceWorker' in navigator;
  const supportsPush = 'PushManager' in window;

  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isPWA,
    isMobile,
    supportsNotifications,
    supportsServiceWorker,
    supportsPush,
  };
}

// ===========================================
// Icons
// ===========================================

const Spinner = ({ className = '' }: { className?: string }) => (
  <div className={`w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} />
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const BellSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

// Apple Share Icon for iOS install instructions
const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
  </svg>
);

// ===========================================
// Error Boundary
// ===========================================

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

// ===========================================
// Main Component
// ===========================================

interface NotificationToggleProps {
  userId: string | undefined;
  className?: string;
}

type NotificationState = 
  | 'loading'
  | 'enabled'
  | 'disabled'
  | 'denied'
  | 'unsupported'
  | 'ios-needs-pwa'
  | 'error';

function NotificationToggleInner({ userId, className = '' }: NotificationToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<NotificationState>('loading');
  const [isProcessing, setIsProcessing] = useState(false);
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check notification status
  useEffect(() => {
    if (!mounted) return;
    
    async function checkStatus() {
      try {
        const platformInfo = detectPlatform();
        setPlatform(platformInfo);

        // iOS Safari (not PWA) - needs special handling
        if (platformInfo.isIOS && !platformInfo.isPWA) {
          setState('ios-needs-pwa');
          return;
        }

        // Check basic support
        if (!platformInfo.supportsNotifications || !platformInfo.supportsServiceWorker) {
          setState('unsupported');
          return;
        }

        // Check Firebase messaging support
        try {
          const { isSupported: checkFirebaseSupport } = await import('firebase/messaging');
          const supported = await checkFirebaseSupport();
          
          if (!supported) {
            setState('unsupported');
            return;
          }
        } catch {
          setState('unsupported');
          return;
        }

        // Check current permission status
        const permission = Notification.permission;
        
        if (permission === 'denied') {
          setState('denied');
          return;
        }

        // Check if user has token saved
        if (permission === 'granted' && userId) {
          const tokenDoc = await getDoc(doc(db, 'fcmTokens', userId));
          setState(tokenDoc.exists() ? 'enabled' : 'disabled');
        } else {
          setState('disabled');
        }
      } catch (err) {
        console.error('Error checking notification status:', err);
        setState('error');
      }
    }

    checkStatus();
  }, [userId, mounted]);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    if (!userId) {
      showError('Trebuie să fii autentificat pentru notificări');
      return;
    }

    setIsProcessing(true);
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'denied') {
        setState('denied');
        showWarning('Ai blocat notificările. Modifică setările browserului pentru a le reactiva.');
        setIsProcessing(false);
        return;
      }
      
      if (permission !== 'granted') {
        showError('Permisiunea pentru notificări a fost refuzată');
        setIsProcessing(false);
        return;
      }

      // Register service worker
      let registration: ServiceWorkerRegistration;
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
      } catch (swError) {
        console.error('Service Worker registration failed:', swError);
        showError('Eroare la înregistrarea serviciului de notificări');
        setIsProcessing(false);
        return;
      }
      
      // Get Firebase messaging
      const { getMessaging, getToken } = await import('firebase/messaging');
      const { default: app } = await import('@/lib/firebase');
      const messaging = getMessaging(app);
      
      // Get token with retry
      const VAPID_KEY = 'BJktvHUoixcedi9A2QdNhRfOw5n4djYRbPPoP6CsVqve-dmIjiNVGwjwJvPGcWYwjxtqBAcyIGuxNq3BW-PsZiI';
      
      let token: string | null = null;
      let retries = 3;
      
      while (retries > 0 && !token) {
        try {
          token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
          });
        } catch (tokenError) {
          console.warn(`Token attempt failed (${retries} retries left):`, tokenError);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (token) {
        // Detect platform for storing
        const platformInfo = detectPlatform();
        const deviceType = platformInfo.isIOS ? 'ios' : platformInfo.isAndroid ? 'android' : 'desktop';
        const browser = platformInfo.isChrome ? 'chrome' : platformInfo.isSafari ? 'safari' : platformInfo.isFirefox ? 'firefox' : 'other';
        
        // Save token to Firestore
        await setDoc(doc(db, 'fcmTokens', userId), {
          token,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          platform: 'web',
          deviceType,
          browser,
          isPWA: platformInfo.isPWA,
          userAgent: navigator.userAgent
        });
        
        setState('enabled');
        showSuccess('Notificările au fost activate! 🔔');
      } else {
        showError('Nu s-a putut obține token-ul pentru notificări. Încearcă din nou.');
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      showError('Eroare la activarea notificărilor');
    } finally {
      setIsProcessing(false);
    }
  }, [userId]);

  // Disable notifications
  const disableNotifications = useCallback(async () => {
    if (!userId) return;
    
    setIsProcessing(true);
    try {
      await deleteDoc(doc(db, 'fcmTokens', userId));
      setState('disabled');
      showInfo('Notificările au fost dezactivate');
    } catch (err) {
      console.error('Error disabling notifications:', err);
      showError('Eroare la dezactivarea notificărilor');
    } finally {
      setIsProcessing(false);
    }
  }, [userId]);

  // Toggle handler
  const handleToggle = async () => {
    if (state === 'enabled') {
      await disableNotifications();
    } else if (state === 'disabled') {
      await enableNotifications();
    }
  };

  // Pre-mount placeholder
  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 ${className}`}>
        <Spinner />
        <span className="text-sm">Se încarcă...</span>
      </div>
    );
  }

  // Loading state
  if (state === 'loading') {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 ${className}`}>
        <Spinner />
        <span className="text-sm">Se verifică...</span>
      </div>
    );
  }

  // iOS needs PWA installation
  if (state === 'ios-needs-pwa') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button
          onClick={() => setShowIOSGuide(!showIOSGuide)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
        >
          <InfoIcon className="w-5 h-5" />
          <span className="text-sm">Cum activez notificările pe iPhone?</span>
        </button>
        
        {showIOSGuide && (
          <div className="bg-slate-800/80 rounded-xl p-4 border border-blue-500/20 text-sm">
            <p className="text-white font-medium mb-3">Pentru a primi notificări pe iPhone/iPad:</p>
            <ol className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">1</span>
                <span>Apasă pe <ShareIcon className="w-4 h-4 inline mx-1" /> (Share) în Safari</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">2</span>
                <span>Selectează &quot;Add to Home Screen&quot; (Adaugă pe ecranul principal)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">3</span>
                <span>Deschide aplicația de pe ecranul principal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">4</span>
                <span>Activează notificările din această secțiune</span>
              </li>
            </ol>
            <p className="text-gray-400 text-xs mt-3">
              * Necesită iOS 16.4 sau mai nou
            </p>
          </div>
        )}
      </div>
    );
  }

  // Permission denied
  if (state === 'denied') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400">
          <BellSlashIcon className="w-5 h-5" />
          <span className="text-sm">Notificările sunt blocate</span>
        </div>
        <p className="text-xs text-gray-400 px-1">
          {platform?.isMobile 
            ? 'Deschide Setări → Notificări → găsește browserul și permite notificările.'
            : 'Click pe 🔒 lângă adresa site-ului și permite notificările.'}
        </p>
      </div>
    );
  }

  // Not supported
  if (state === 'unsupported' || state === 'error') {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 ${className}`}>
        <BellSlashIcon className="w-5 h-5" />
        <span className="text-sm">
          {platform?.isMobile 
            ? 'Folosește Chrome sau Safari pentru notificări'
            : 'Browserul nu suportă notificări push'}
        </span>
      </div>
    );
  }

  // Main toggle button
  return (
    <button
      onClick={handleToggle}
      disabled={isProcessing}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        state === 'enabled'
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isProcessing ? (
        <Spinner />
      ) : state === 'enabled' ? (
        <BellIcon className="w-5 h-5" />
      ) : (
        <BellSlashIcon className="w-5 h-5" />
      )}
      <span className="text-sm">
        {isProcessing 
          ? 'Se procesează...'
          : state === 'enabled' 
            ? 'Notificări active' 
            : 'Activează notificări'}
      </span>
    </button>
  );
}

// Export with error boundary
export function NotificationToggle(props: NotificationToggleProps) {
  return (
    <NotificationErrorBoundary>
      <NotificationToggleInner {...props} />
    </NotificationErrorBoundary>
  );
}
