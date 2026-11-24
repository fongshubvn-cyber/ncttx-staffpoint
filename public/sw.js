// Staffpoint Service Worker for Mobile Notifications & PWA
const CACHE_NAME = 'staffpoint-v1.041';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy for HTML and JS scripts to avoid stale cache on mobile
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate' || req.destination === 'script' || req.destination === 'style') {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      return clients.openWindow(self.registration.scope || './');
    })
  );
});
