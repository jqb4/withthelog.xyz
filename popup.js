const icon = document.getElementById('infoIcon');
const popup = document.getElementById('popupInfo');
const overlay = document.getElementById('overlay');
let popupOpen = false; // Track if the popup is open

// Toggle popup visibility
icon.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents the window click event from firing
  if (!popupOpen) {
    popup.classList.add('show'); // Show the popup with animation
    overlay.classList.add('show'); // Show the overlay
    document.body.classList.add('blur'); // Add blur to the body
    popupOpen = true;
  } else {
    closePopup();
  }
});

// Hide popup when clicking outside the popup or icon
window.addEventListener('click', (e) => {
  if (popupOpen && !popup.contains(e.target) && !icon.contains(e.target)) {
    closePopup(); // Close the popup if clicked outside
  }
});

// Function to close the popup
function closePopup() {
  popup.classList.remove('show'); // Hide the popup
  overlay.classList.remove('show'); // Hide the overlay
  document.body.classList.remove('blur'); // Remove blur from the body
  popupOpen = false; // Update the state
}

// Prevent closing the popup when clicking inside it
popup.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents closing the popup when clicking inside it
});