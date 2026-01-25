const CACHE_NAME = "ocjt-cache-v1";

// Files to cache (add more if needed)
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js"
];

// Install (cache files)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate and delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Update mechanism
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Fetch fresh version in background
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            // Notify page that update is ready
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: "NEW_VERSION" });
              });
            });
          });
          return networkResponse.clone();
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});