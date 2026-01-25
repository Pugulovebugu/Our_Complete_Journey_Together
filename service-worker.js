const CACHE_NAME = "ocjt-cache-v3"; // change number whenever you update
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icon-192.png",
  "/icon-512.png"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE — remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH with auto-update detection
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());

            // Notify page about update
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: "UPDATE_AVAILABLE" });
              });
            });
          });
          return response.clone();
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
