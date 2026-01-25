// PWA Cache Setup
const CACHE_NAME = "ocjt-cache-v4";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/firebase-notification.js",
  "/icon-192.png",
  "/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch + auto-update
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());

            // Notify clients of update
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

// 🔥 FIREBASE PUSH NOTIFICATIONS
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBNOw0v5SoDLs1a3Pku1klVhZIZZqqs0fo",
  authDomain: "our-complete-journey-together.firebaseapp.com",
  projectId: "our-complete-journey-together",
  messagingSenderId: "462695312802",
  appId: "1:462695312802:web:70076c81c14cf1e872d6fb"
});

// Handle background push
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});