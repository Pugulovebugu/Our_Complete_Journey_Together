// Listen for update messages
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data.type === "UPDATE_AVAILABLE") {
      showUpdatePopup();
    }
  });
}

// Show pink update popup
function showUpdatePopup() {
  const popup = document.createElement("div");
  popup.className = "update-popup";
  popup.innerHTML = "💖 New update available — Tap to refresh";

  popup.onclick = () => location.reload();

  document.body.appendChild(popup);
}
