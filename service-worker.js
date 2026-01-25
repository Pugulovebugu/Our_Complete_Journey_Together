const CACHE_NAME = "love-journey-v3";
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

// Install new version immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate immediately and delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Always try network first → ensures fresh data
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache fresh file
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Offline fallback
  );
});
