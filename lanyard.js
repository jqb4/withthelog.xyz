let ws;

function connectToLanyard() {
  ws = new WebSocket("wss://api.lanyard.rest/socket");

  ws.onopen = () => {
    console.log("Connected to Lanyard");
    ws.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: "712648730423197697", // Discord User ID
        },
      })
    );
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Full WebSocket message received:", data);

    if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
      const presence = data.d;

      // Update HTML content dynamically
      const activityElement = document.getElementById("activity");
      const albumArtElement = document.getElementById("albumArt");
      const separatorElement = document.querySelector(".separator"); // Select the separator element

      // Update the activity text and display Spotify data
      if (presence.listening_to_spotify) {
        const spotifyData = presence.spotify;
        activityElement.textContent = `${spotifyData.song} - ${spotifyData.artist}`;

        // Load album art with CORS
        albumArtElement.crossOrigin = "Anonymous"; // Set CORS attribute
        albumArtElement.src = spotifyData.album_art_url; // Update album art URL
        albumArtElement.style.display = "block"; // Show the album art
        separatorElement.style.display = "block"; // Show the separator when a song is playing

        // Extract colors and set gradient background
        albumArtElement.onload = function () {
          const colorThief = new ColorThief();

          try {
            // Check if the image is valid
            if (albumArtElement.naturalWidth > 0 && albumArtElement.naturalHeight > 0) {
              const dominantColor = colorThief.getColor(albumArtElement);
              const palette = colorThief.getPalette(albumArtElement, 3);

              const gradient = `linear-gradient(135deg, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, ${dominantColor[3]}), rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}, ${palette[1][3]}))`;
              document.body.style.background = gradient; // Set the new gradient background
            } else {
              console.error("Invalid image dimensions. Cannot extract colors.");
            }
          } catch (error) {
            console.error("Error extracting colors from the image:", error);
          }
        };

        // Handle errors while loading the album art
        albumArtElement.onerror = function () {
          console.error("Error loading album art image. Please check the URL.");
          activityElement.textContent = "Failed to load album art.";
          separatorElement.style.display = "none"; // Hide the separator if the image fails to load
        };
      } else {
        activityElement.textContent = "offline :(";
        albumArtElement.style.display = "none"; // Hide the album art if not listening to Spotify
        separatorElement.style.display = "none"; // Hide the separator when no song is playing
      }
    }
  };
}

// Start the WebSocket connection after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  connectToLanyard();
});
