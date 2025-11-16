/* eslint-disable no-restricted-globals */

// Service Worker for PWA Push Notifications

const CACHE_NAME = 'jadwal-lab-v1';
const urlsToCache = [
    '/',
    '/dashboard',
    '/jadwal',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Push event - show notification
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();
    const options = {
        body: data.message || 'Anda memiliki notifikasi baru',
        icon: '/logo_unuha.png',
        badge: '/logo_unuha.png',
        vibrate: [200, 100, 200],
        tag: data.type || 'notification',
        data: {
            url: data.url || '/notifications',
            notificationId: data.id,
        },
        actions: [
            {
                action: 'open',
                title: 'Lihat',
            },
            {
                action: 'close',
                title: 'Tutup',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Jadwal Lab', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/notifications';

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Check if there's already a window open
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notifications') {
        event.waitUntil(syncNotifications());
    }
});

async function syncNotifications() {
    try {
        const response = await fetch('/notifications/unread');
        const data = await response.json();
        
        // Update notification badge
        if (navigator.setAppBadge && data.unread_count > 0) {
            await navigator.setAppBadge(data.unread_count);
        }
    } catch (error) {
        console.error('Failed to sync notifications:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-notifications') {
        event.waitUntil(syncNotifications());
    }
});
