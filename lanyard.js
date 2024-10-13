const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.onopen = () => {
  console.log("Connected to Lanyard");
  ws.send(
    JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "712648730423197697", // Replace with your actual Discord ID
      },
    })
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Full WebSocket message received:", data);

  if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
    const presence = data.d;

    const statusElement = document.getElementById("status");
    const activityElement = document.getElementById("activity");

    // Set the general Discord status
    statusElement.textContent = `Status: ${presence.discord_status}`;

    // Check if Spotify is active and display details
    if (presence.listening_to_spotify) {
      const spotifyData = presence.spotify;
      activityElement.textContent = `Listening to ${spotifyData.song} by ${spotifyData.artist}`;
      
      // Optionally display album art
      const albumArtElement = document.getElementById("albumArt");
      if (albumArtElement) {
        albumArtElement.src = spotifyData.album_art_url; // Make sure you have an <img> element with id="albumArt"
      }
    } else {
      activityElement.textContent = "No activity detected or Spotify is not playing.";
    }
  }
};


ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};
