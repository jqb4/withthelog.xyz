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
      console.log("Presence data:", presence);

      // Update DOM with presence data (adjust this part to match your existing code)
      const statusElement = document.getElementById("status");
      const activityElement = document.getElementById("activity");

      statusElement.textContent = `Status: ${presence.discord_status}`;

      if (presence.listening_to_spotify) {
        const spotifyData = presence.spotify;
        activityElement.textContent = `Listening to ${spotifyData.song} by ${spotifyData.artist}`;
        const albumArtElement = document.getElementById("albumArt");
        if (albumArtElement) {
          albumArtElement.src = spotifyData.album_art_url;
        }
      } else {
        activityElement.textContent = "No current activity.";
      }
    } else {
      console.log("Unknown data format or no presence updates.");
    }
  };

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
