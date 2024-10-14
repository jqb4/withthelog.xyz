const icon = document.getElementById('infoIcon');
const popup = document.getElementById('popupInfo');
let popupOpen = false; // Track if the popup is open

// Toggle popup visibility
icon.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents the window click event from firing
  if (!popupOpen) {
    popup.classList.add('show'); // Show the popup with animation
    popupOpen = true;
  } else {
    popup.classList.remove('show'); // Hide the popup
    popupOpen = false;
  }
});

// Hide popup when clicking outside the popup or icon
window.addEventListener('click', (e) => {
  if (popupOpen && !popup.contains(e.target) && !icon.contains(e.target)) {
    popup.classList.remove('show'); // Hide the popup
    popupOpen = false; // Update the state
  }
});

// Prevent closing the popup when clicking inside it
popup.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents closing the popup when clicking inside it
});