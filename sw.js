const CACHE_NAME = 'shedaby-spa-v2';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './price.html',
  './appointment.html',
  './contact.html',
  './style.css',
  './script.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never intercept non-GET requests (e.g., Firestore POST/PUT calls)
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Never intercept third-party APIs (Firebase, Google APIs, Smartsupp)
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('smartsupp')
  ) {
    return;
  }

  // 3. Cache-first strategy for static website assets with fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((err) => {
        console.warn('Network fetch failed for asset:', event.request.url, err);
      });
    })
  );
});