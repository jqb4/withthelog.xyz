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
    const statusElement = document.getElementById("status");
    const activityElement = document.getElementById("activity");
    const albumArtElement = document.getElementById("albumArt");

    // Update the status text
    statusElement.textContent = `Status: ${presence.discord_status}`;

    // Update the activity text and display Spotify data
    if (presence.listening_to_spotify) {
      const spotifyData = presence.spotify;
      activityElement.textContent = `Listening to ${spotifyData.song} by ${spotifyData.artist}`;

      // Display album art
      albumArtElement.src = spotifyData.album_art_url;
      albumArtElement.style.display = "block"; // Show the album art
    } else {
      activityElement.textContent = "No current activity.";
      albumArtElement.style.display = "none"; // Hide the album art if not listening to Spotify
    }
  }
};


// Start the WebSocket connection
connectToLanyard();
