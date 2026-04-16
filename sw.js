const CACHE_NAME = 'gymvital-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/hombres.html',
  '/inicial3diashombre.html',
  '/inicial5diashombre.html',
  '/intermedio3diashombre.html',
  '/intermedio5diashombre.html',
  '/avanzado3diashombre.html',
  '/avanzado5diashombre.html',
  '/styles.css',
  '/styleshombres.css',
  '/img/fondo.jpg',
  '/img/fondo1.jpg',
  '/img/rutinah.jpg',
  '/img/rutinam.jpg',
  '/img/hit.jpg',
  '/img/pareja.jpg',
  '/img/inicialhombre.jpg',
  '/img/intermediohombre.webp',
  '/img/avanzadohombre.jpg',
  '/img/transparent-Photoroom.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/exercise-3d.css',
  '/exercise-3d.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
