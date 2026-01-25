

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNOw0v5SoDLs1a3Pku1klVhZIZZqqs0fo",
  authDomain: "our-complete-journey-together.firebaseapp.com",
  projectId: "our-complete-journey-together",
  storageBucket: "our-complete-journey-together.firebasestorage.app",
  messagingSenderId: "462695312802",
  appId: "1:462695312802:web:70076c81c14cf1e872d6fb"
};

firebase.initializeApp(firebaseConfig);

// Set up messaging
const messaging = firebase.messaging();

// Ask user for permission + get token
async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await messaging.getToken({
        vapidKey: "BAHYeMTr-w5PDJHnTkpUd0dj1C57iwNysnjZpmrDb7ODPfkaF1eRBBkFgP1kKO5AjMG9I1ztqt40A-vLjNDgvYA"
      });

      console.log("🌟 FCM Token:", token);
    } else {
      console.log("❌ Notification permission denied");
    }
  } catch (e) {
    console.error("Error getting token:", e);
  }
}

initNotifications();
// Subscribe this user to a topic for global notifications
async function subscribeToTopic(token) {
  await fetch(
    `https://iid.googleapis.com/iid/v1/${token}/rel/topics/allUsers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    }
  );
}

messaging.getToken({ vapidKey: "YOUR_VAPID_KEY" })
  .then((token) => {
    if (token) {
      console.log("FCM Token:", token);
      subscribeToTopic(token);
    }
  });