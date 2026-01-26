// -------------------------------
// PWA CACHE SETTINGS
// -------------------------------
const CACHE_NAME = "ocjt-cache-v20260125";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/firebase-notification.js",
  "/icon-192.png",
  "/icon-512.png"
];

// -------------------------------
// INSTALL EVENT
// -------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  // Activate new SW immediately
  self.skipWaiting();
});

// -------------------------------
// ACTIVATE EVENT
// -------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  // Take control of all open clients immediately
  self.clients.claim();
});

// -------------------------------
// FETCH EVENT (Better auto-update)
// -------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // Try network first (always get fresh files)
        const response = await fetch(event.request);

        // Update cache in background
        cache.put(event.request, response.clone());

        return response;
      } catch (error) {
        // If offline → serve from cache
        const cached = await cache.match(event.request);
        return cached || Response.error();
      }
    })()
  );
});

// -------------------------------
// FIREBASE PUSH NOTIFICATIONS
// -------------------------------
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBNOw0v5SoDLs1a3Pku1klVhZIZZqqs0fo",
  authDomain: "our-complete-journey-together.firebaseapp.com",
  projectId: "our-complete-journey-together",
  messagingSenderId: "462695312802",
  appId: "1:462695312802:web:70076c81c14cf1e872d6fb"
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});