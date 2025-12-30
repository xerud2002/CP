// Firebase Messaging Service Worker
// This runs in background to receive push notifications

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
    badge: '/img/logo-favicon-32.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: 'Deschide'
      },
      {
        action: 'close',
        title: 'Închide'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Get the URL to open from notification data
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes('curierulperfect.com') && 'focus' in client) {
          client.focus();
          if (urlToOpen !== '/') {
            client.navigate(urlToOpen);
          }
          return;
        }
      }
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
