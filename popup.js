const icon = document.getElementById('infoIcon');
const popup = document.getElementById('popupInfo');
let popupOpen = false; // Track if the popup is open

// Show popup when clicking on the icon
icon.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents the window click event from firing
  popup.style.display = popupOpen ? 'none' : 'block'; // Toggle the popup's visibility
  popupOpen = !popupOpen; // Update the state
});

// Hide popup when clicking outside the popup or icon
window.addEventListener('click', (e) => {
  if (popupOpen && !popup.contains(e.target) && !icon.contains(e.target)) {
    popup.style.display = 'none'; // Hide the popup
    popupOpen = false; // Update the state
  }
});

// Prevent closing the popup when clicking inside it
popup.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents closing the popup when clicking inside it
});