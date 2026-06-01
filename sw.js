const CACHE_NAME = 'sedile-hra-v4.5';
const ASSETS = [
    './',
    './index.html',
    './style.css?v=3.43',
    './app_core.js?v=4.56',
    './manifest.json',
    './logo.png',
    './libs/supabase.js',
    './libs/chart.js',
    './minsal_data.js',
    './pittaluga_data.js',
    './special_data.js'
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
    // 1. ONLY intercept GET requests (ignore POST, PUT, DELETE, etc.)
    if (e.request.method !== 'GET') {
        return;
    }

    // 2. EXPLICITLY bypass cross-origin Supabase requests
    if (e.request.url.includes('supabase.co') || e.request.url.includes('/rest/v1/')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
