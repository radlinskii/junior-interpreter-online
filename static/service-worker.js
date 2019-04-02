const CACHE_NAME = 'junior-interpreter-online-v1';
const urlsToCache = [
    '/',
    '/main.css',
    '/main.js',
    '/monaco.js',
    '/sw.js',
    '/index.html',
    '/assets/github.png',
    '/assets/favicon/favicon-16x16.png',
    '/assets/favicon/favicon-32x32.png',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/site.webmanifest',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/android-chrome-192x192.png',
    '/assets/favicon/android-chrome-512x512.png',
    '/vs/loader.js',
    '/vs/editor/editor.main.css',
    '/vs/editor/editor.main.js',
    '/vs/editor/editor.main.nls.js',
    '/vs/base/worker/workerMain.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
