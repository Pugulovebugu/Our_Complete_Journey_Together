const CACHE_NAME = "love-journey-v3";

const FILES_TO_CACHE = [
  "index.html",
  "earlydays.html",
  "anniversaries.html",
  "specialdays.html",
  "gallery.html",
  "emotional_support.html",
  "style.css",          // ✅ FIX: included safely
  "icon-192.png",
  "icon-512.png",
  "manifest.json"
];

// Install Service Worker → Cache files safely
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(FILES_TO_CACHE);
        console.log("✨ Files cached successfully!");
      } catch (err) {
        console.warn("⚠️ Cache error:", err);
      }
    })
  );
  self.skipWaiting();
});

// Activate Service Worker → Remove old caches
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

// Fetch → Offline first, then network fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match("index.html"))
      );
    })
  );
});
