// Initialize Firebase (v8 compatible)
const firebaseConfig = {
  apiKey: "AIzaSyBNOw0v5SoDLs1a3Pku1klVhZIZZqqs0fo",
  authDomain: "our-complete-journey-together.firebaseapp.com",
  projectId: "our-complete-journey-together",
  storageBucket: "our-complete-journey-together.firebasestorage.app",
  messagingSenderId: "462695312802",
  appId: "1:462695312802:web:70076c81c14cf1e872d6fb"
};

firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Request notification permission + get token
messaging
  .requestPermission()
  .then(() => {
    console.log("Notification permission granted.");

    return messaging.getToken({
      vapidKey:
        "BAHYeMTr-w5PDJHnTkpUd0dj1C57iwNysnjZpmrDb7ODPfkaF1eRBBkFgP1kKO5AjMG9I1ztqt40A-vLjNDgvYA"
    });
  })
  .then((token) => {
    console.log("🌟 FCM Token:", token);

    // SHOW TOKEN ON SCREEN (Android friendly)
    const box = document.createElement("div");
    box.style.padding = "20px";
    box.style.margin = "20px";
    box.style.background = "#ffe6ef";
    box.style.color = "#333";
    box.style.border = "2px solid #ff8fc8";
    box.style.borderRadius = "12px";
    box.style.fontSize = "14px";
    box.style.wordBreak = "break-all";
    box.style.boxShadow = "0 0 10px rgba(255,120,170,0.4)";
    box.innerHTML = "<b>Your FCM Token:</b><br><br>" + token;

    document.body.appendChild(box);
  })
  .catch((err) => {
    console.error("Error getting permission or token:", err);
  });

// Foreground notifications
messaging.onMessage((payload) => {
  console.log("Message in foreground:", payload);
});
