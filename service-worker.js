const CACHE_NAME = "love-journey-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/earlydays.html",
  "/anniversaries.html",
  "/specialdays.html",
  "/gallery.html",
  "/emotional_support.html",
  "/style.css",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

// Install SW → Cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate → Clean old caches
self.addEventListener("activate", (event) => {
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

// Fetch → Offline support
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedFile) => {
      return cachedFile || fetch(event.request);
    })
  );
});
