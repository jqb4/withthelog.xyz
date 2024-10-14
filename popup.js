const icon = document.getElementById('infoIcon');
    const popup = document.getElementById('popupInfo');

    // Show popup when clicking on the icon
    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents the click from triggering the window event
      popup.style.display = 'block';
    });

    // Hide popup when clicking outside the popup or icon
    window.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && e.target !== icon && !icon.contains(e.target)) {
        popup.style.display = 'none';
      }
    });

    // Prevent closing the popup when clicking inside it
    popup.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents closing the popup when clicking inside it
    });
