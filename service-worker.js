// Cache Setup
const CACHE_NAME = "ocjt-cache-v5";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./firebase-notification.js",
  "./icon-192.png",
  "./icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

// Fetch with auto-update
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());

            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
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

// --------------------------
// FIREBASE CLOUD MESSAGING
// --------------------------
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBNOw0v5SoDLs1a3Pku1klVhZIZZqqs0fo",
  authDomain: "our-complete-journey-together.firebaseapp.com",
  projectId: "our-complete-journey-together",
  messagingSenderId: "462695312802",
  appId: "1:462695312802:web:70076c81c14cf1e872d6fb"
});

const messaging = firebase.messaging();

// Background notifications
messaging.setBackgroundMessageHandler(function (payload) {
  return self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "./icon-192.png"
  });
});
