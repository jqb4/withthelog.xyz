let ws;

function connectToLanyard() {
  ws = new WebSocket("wss://api.lanyard.rest/socket");

  ws.onopen = () => {
    console.log("Connected to Lanyard");
    ws.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: "712648730423197697", // Replace with your Discord ID
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

      // Update the activity text and display Spotify data
      if (presence.listening_to_spotify) {
        const spotifyData = presence.spotify;
        activityElement.textContent = `${spotifyData.song} - ${spotifyData.artist}`;

        // Display album art
        albumArtElement.src = spotifyData.album_art_url; // Update album art URL
        albumArtElement.style.display = "block"; // Show the album art

        // Extract colors and set gradient background
        const colorThief = new ColorThief();
        albumArtElement.onload = function () {
          const dominantColor = colorThief.getColor(albumArtElement);
          const palette = colorThief.getPalette(albumArtElement, 2);
          
          const gradient = `linear-gradient(135deg, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}), rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}))`;
          document.body.style.background = gradient;
        };
      } else {
        activityElement.textContent = "offline :(";
        albumArtElement.style.display = "none"; // Hide the album art if not listening to Spotify
      }
    }
  };
}

// Start the WebSocket connection after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  connectToLanyard();
});