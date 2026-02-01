const CACHE_NAME = 'sedile-hra-v2'; // Bumped version
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './favicon.jpg'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force new SW to activate immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        clients.claim() // Take control of open pages immediately
            .then(() => {
                // Optional: Clear old caches that don't match current CACHE_NAME
                return caches.keys().then(keys => Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME) return caches.delete(key);
                    })
                ));
            })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
