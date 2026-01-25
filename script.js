// Listen for service worker update messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data.type === "NEW_VERSION") {
      showUpdatePopup();
    }
  });
}

// Popup function
function showUpdatePopup() {
  // Create popup div
  const popup = document.createElement("div");
  popup.id = "updatePopup";
  popup.innerHTML = `
    <div class="update-message">
      💖 New update available — Tap to refresh
    </div>
  `;

  // Click to refresh
  popup.onclick = () => location.reload();

  // Add to page
  document.body.appendChild(popup);
}

