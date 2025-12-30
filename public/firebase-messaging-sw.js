// Firebase Messaging Service Worker
// This runs in background to receive push notifications
// Supports: Android Chrome/Firefox, iOS Safari (PWA), Desktop browsers

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCE3CJOc3kl67H7gOdPeEaJ5dNIBJcS0Lo",
  authDomain: "curierulperfect.firebaseapp.com",
  projectId: "curierulperfect",
  storageBucket: "curierulperfect.firebasestorage.app",
  messagingSenderId: "142504385307",
  appId: "1:142504385307:web:8d93a9c891d5e1a5f1f8a3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Curierul Perfect';
  const notificationOptions = {
    body: payload.notification?.body || 'Ai o notificare nouă',
    icon: '/img/logo-favicon-192.png',
    badge: '/img/logo-favicon-96.png',
    tag: payload.data?.tag || `notification-${Date.now()}`,
    data: payload.data || {},
    // Vibration pattern: vibrate 200ms, pause 100ms, vibrate 200ms
    vibrate: [200, 100, 200],
    // Show notification even if app is focused (for some browsers)
    requireInteraction: false,
    // Renotify if same tag is used
    renotify: true,
    // Silent mode off - we want sound
    silent: false,
    // Actions for Android/Desktop
    actions: [
      {
        action: 'open',
        title: 'Deschide',
        icon: '/img/logo-favicon-96.png'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  
  event.notification.close();

  // Handle action buttons
  if (event.action === 'close') {
    return;
  }

  // Get the URL to open from notification data
  const data = event.notification.data || {};
  let urlToOpen = data.url || data.click_action || '/dashboard/client';

  // Make sure URL is absolute
  if (!urlToOpen.startsWith('http')) {
    urlToOpen = self.location.origin + urlToOpen;
  }

  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then((windowClients) => {
      // Check if there's already a window/tab open
      for (const client of windowClients) {
        // Check if the client is from our domain
        if (client.url.includes(self.location.origin)) {
          // Focus existing window and navigate
          return client.focus().then((focusedClient) => {
            if (focusedClient && 'navigate' in focusedClient) {
              return focusedClient.navigate(urlToOpen);
            }
          });
        }
      }
      // No existing window, open a new one
      return clients.openWindow(urlToOpen);
    })
  );
});

// Handle push event directly (fallback for some browsers)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received');
  
  if (!event.data) {
    console.log('[firebase-messaging-sw.js] No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[firebase-messaging-sw.js] Push data:', data);
    
    // If Firebase SDK already handled it, skip
    if (data.notification) {
      return;
    }
    
    // Handle data-only messages
    if (data.data) {
      const title = data.data.title || 'Curierul Perfect';
      const options = {
        body: data.data.body || 'Ai o notificare nouă',
        icon: '/img/logo-favicon-192.png',
        badge: '/img/logo-favicon-96.png',
        tag: data.data.tag || `push-${Date.now()}`,
        data: data.data,
        vibrate: [200, 100, 200]
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    }
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Error handling push:', err);
  }
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(clients.claim());
});

// Service worker installation  
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  event.waitUntil(self.skipWaiting());
});
