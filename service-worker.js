const CACHE_NAME = "statistik-app-v10.1";

// Dateien, die wirklich gecached werden sollen
const ASSETS = [
    "./",
    "./index.html",
    "./chart.js",
    "./manifest.json"
];

// INSTALL: Cache initial befüllen
self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// ACTIVATE: alte Caches löschen + sofort übernehmen
self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
            await self.clients.claim();
        })()
    );
});

// FETCH: Netzwerk zuerst, Cache als Backup
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
