let ws;
let progressInterval; // To hold the interval reference for updating progress
let songEndTimeout; // To reset the UI when the song ends

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
      const separatorElement = document.querySelector(".separator");
      const progressBar = document.getElementById("progressBar");

      // Clear any existing progress interval or song end timeout
      if (progressInterval) clearInterval(progressInterval);
      if (songEndTimeout) clearTimeout(songEndTimeout);

      // Update the activity text and display Spotify data
      if (presence.listening_to_spotify) {
        const spotifyData = presence.spotify;
        activityElement.textContent = `${spotifyData.song} - ${spotifyData.artist}`;

        // Load album art with CORS
        albumArtElement.crossOrigin = "Anonymous";
        albumArtElement.src = spotifyData.album_art_url;
        albumArtElement.style.display = "block";
        separatorElement.style.display = "block";
        progressBar.style.display = "block";

        // Get the start and end timestamps of the song
        const startTime = spotifyData.timestamps.start;
        const endTime = spotifyData.timestamps.end;
        const duration = endTime - startTime;

        // Update the progress bar in real time
        const updateProgress = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = (elapsed / duration) * 100;
          progressBar.value = progress;

          if (progress >= 100) clearInterval(progressInterval); // Stop updating when the song is over
        };

        // Update the progress bar every second
        updateProgress();
        progressInterval = setInterval(updateProgress, 1000);

        // Set a timeout to reset the UI when the song ends
        songEndTimeout = setTimeout(() => {
          resetSongDisplay();
        }, duration); // Reset after the song's duration

        // Extract colors and set gradient background
        albumArtElement.onload = function () {
          try {
            const colorThief = new ColorThief();
            if (albumArtElement.complete && albumArtElement.naturalHeight !== 0) {
              const dominantColor = colorThief.getColor(albumArtElement);
              const palette = colorThief.getPalette(albumArtElement, 3);

              const gradient = `linear-gradient(135deg, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}), rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}))`;
              document.body.style.background = gradient;
            } else {
              console.error("Image not loaded properly.");
            }
          } catch (error) {
            console.error("Failed to extract colors from image.", error);
          }
        };

      } else {
        // Reset if no Spotify activity
        resetSongDisplay();
      }
    }
  };
}

// Function to reset the song display (called when the song ends)
function resetSongDisplay() {
  const activityElement = document.getElementById("activity");
  const albumArtElement = document.getElementById("albumArt");
  const separatorElement = document.querySelector(".separator");
  const progressBar = document.getElementById("progressBar");

  activityElement.textContent = "offline :(";
  albumArtElement.style.display = "none";
  separatorElement.style.display = "none";
  progressBar.style.display = "none";
  progressBar.value = 0; // Reset progress bar
}

// Start the WebSocket connection after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  connectToLanyard();
});