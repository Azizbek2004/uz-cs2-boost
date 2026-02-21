// Service Worker for UZ CS2 Boost
// Provides offline support for spray simulator and basic caching

const CACHE_NAME = "uz-cs2-boost-v1";
const OFFLINE_URLS = [
    "/spray-simulator",
    "/offline.html",
];

// Assets to cache on install
const PRECACHE_ASSETS = [
    "/",
    "/spray-simulator",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn("SW: Precache failed for some assets:", err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Network-first for API calls, cache-first for static assets
    if (event.request.url.includes("/api/") || event.request.url.includes("convex")) {
        // Network only for API requests
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version, update cache in background
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => { });

                return cachedResponse;
            }

            // Not in cache, try network
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Return offline page for navigation requests
                if (event.request.mode === "navigate") {
                    return caches.match("/offline.html");
                }
                return new Response("Offline", { status: 503 });
            });
        })
    );
});
