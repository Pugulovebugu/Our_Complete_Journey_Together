let deferredPrompt;
const banner = document.getElementById("installBanner");

// Listen for Chrome install event
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install banner
    banner.style.display = "block";
});

// When banner is clicked → show install prompt
banner.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    banner.style.display = "none"; // hide banner
    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
        console.log("User installed app");
    }

    deferredPrompt = null;
});

// Service worker update popup handler
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data.type === "UPDATE_AVAILABLE") {
      showUpdatePopup();
    }
  });
}

function showUpdatePopup() {
  const popup = document.createElement("div");
  popup.className = "update-popup";
  popup.innerHTML = "💖 New update available — Tap to refresh";
  popup.onclick = () => location.reload();
  document.body.appendChild(popup);
}
