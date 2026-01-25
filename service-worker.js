const CACHE_NAME = "journey-cache-v4";

// The base folder of your GitHub Pages site
const BASE = "/Our_Complete_Journey_Together/";

const FILES_TO_CACHE = [
  BASE + "index.html",
  BASE + "earlydays.html",
  BASE + "anniversaries.html",
  BASE + "specialdays.html",
  BASE + "gallery.html",
  BASE + "emotional_support.html",
  BASE + "style.css",
  BASE + "icon-192.png",
  BASE + "icon-512.png",
  BASE + "manifest.json"
];

// INSTALL — Cache everything safely
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(FILES_TO_CACHE);
        console.log("✨ Cached Successfully");
      } catch (err) {
        console.warn("⚠️ Cache error:", err);
      }
    })
  );
  self.skipWaiting();
});

// ACTIVATE — Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑️ Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH — Offline support
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match(BASE + "index.html"))
      );
    })
  );
});
