import { useEffect } from 'react';

export function usePWA() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Register service worker
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);

                    // Request notification permission
                    if ('Notification' in window && Notification.permission === 'default') {
                        Notification.requestPermission().then((permission) => {
                            console.log('Notification permission:', permission);
                        });
                    }

                    // Enable periodic background sync (if supported)
                    if ('periodicSync' in registration) {
                        registration.periodicSync
                            .register('check-notifications', {
                                minInterval: 5 * 60 * 1000, // 5 minutes
                            })
                            .then(() => {
                                console.log('Periodic sync registered');
                            })
                            .catch((error) => {
                                console.error('Periodic sync failed:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }

        // Listen for updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker updated');
                // Optionally reload the page
                // window.location.reload();
            });
        }
    }, []);

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    };

    const showNotification = (title: string, options?: NotificationOptions) => {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        icon: '/logo_unuha.png',
                        badge: '/logo_unuha.png',
                        vibrate: [200, 100, 200],
                        ...options,
                    });
                });
            }
        }
    };

    return {
        requestNotificationPermission,
        showNotification,
    };
}
