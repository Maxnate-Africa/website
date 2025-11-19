const CACHE_NAME = 'maxcms-v1';
const CORE_ASSETS = [
  './admin.html',
  './css/admin.css',
  './js/admin-appwrite.js',
  './js/appwrite-config.js',
  './assets/svg/maxnate-logo-teal.svg',
  './assets/svg/maxnate-logo-white.svg',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkRes => {
        const copy = networkRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
        return networkRes;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
