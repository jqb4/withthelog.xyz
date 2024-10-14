const icon = document.getElementById('infoIcon');
    const popup = document.getElementById('popupInfo');

    // Show popup when clicking on the icon
    icon.addEventListener('click', () => {
      popup.style.display = 'block';
    });

    // Hide popup when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target !== icon && !popup.contains(e.target)) {
        popup.style.display = 'none';
      }
    });