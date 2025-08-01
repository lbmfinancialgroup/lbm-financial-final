// Service Worker for caching and performance optimization
const CACHE_NAME = 'lbm-financial-v1.0.0';
const STATIC_CACHE_NAME = 'lbm-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'lbm-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/images/logo.svg',
    '/images/hero-image.png',
    '/images/Team Lead-image.png'
];

// Resources to cache on demand
const DYNAMIC_ASSETS = [
    '/images/Financial Operations-image.png',
    '/images/Business Consulting-image.png',
    '/images/Treasury management-image.png',
    '/images/Tax pre & compliance-image.png',
    '/images/Class Action & Settlement Consulting-image.png',
    '/images/community support-image.png',
    '/images/Financial Literacy.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests (except fonts)
    if (url.origin !== location.origin && !url.hostname.includes('fonts.g')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then(networkResponse => {
                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseToCache = networkResponse.clone();

                        // Determine which cache to use
                        const cacheName = STATIC_ASSETS.includes(url.pathname) ? STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;

                        // Cache the response
                        caches.open(cacheName)
                            .then(cache => {
                                console.log('Service Worker: Caching new resource', request.url);
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Fetch failed', error);
                        
                        // Return offline fallback for HTML requests
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(
            // Handle offline form submissions here
            Promise.resolve()
        );
    }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('Service Worker: Push notification received', data);
        
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/images/logo.svg',
                badge: '/images/logo.svg'
            })
        );
    }
});