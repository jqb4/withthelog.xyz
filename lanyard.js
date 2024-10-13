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
      // const statusElement = document.getElementById("status"); // Remove this line to omit status
      const activityElement = document.getElementById("activity");
      const albumArtElement = document.getElementById("albumArt");

      // You can omit the following line if you don't want to show status
      // statusElement.textContent = `Status: ${presence.discord_status}`;

      // Update the activity text and display Spotify data
      if (presence.listening_to_spotify) {
        const spotifyData = presence.spotify;
        activityElement.textContent = `${spotifyData.song} - ${spotifyData.artist}`;

        // Display album art
        albumArtElement.src = spotifyData.album_art_url;
        albumArtElement.style.display = "block"; // Show the album art
      } else {
        activityElement.textContent = "offline :(";
        albumArtElement.style.display = "none"; // Hide the album art if not listening to Spotify
      }
    }
  }; // Closing the onmessage function

  ws.onclose = () => {
    console.log("WebSocket connection closed, reconnecting...");
    setTimeout(connectToLanyard, 5000); // Reconnect after 5 seconds
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    ws.close();
  };
}

// Start the WebSocket connection
connectToLanyard();
