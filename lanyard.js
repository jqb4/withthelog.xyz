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
                    const albumArtLink = document.getElementById("albumArtLink"); // Anchor element for clickable album art
                    const separatorElement = document.querySelector(".separator"); // Select the separator element

                    // Reset the previous song data
                    resetSongData();

                    // Update the activity text and display Spotify data
                    if (presence.listening_to_spotify) {
                        const spotifyData = presence.spotify;

                        // Update song and artist display with a dash and comma separator for multiple artists
                        const artistNames = spotifyData.artist.replace(/;/g, ", "); // Replace any semicolon with a comma
                        activityElement.textContent = `${spotifyData.song} - ${artistNames}`;

                        // Load album art with CORS and make it clickable to the Spotify URL
                        albumArtElement.crossOrigin = "Anonymous"; // Set CORS attribute
                        albumArtElement.src = spotifyData.album_art_url; // Update album art URL
                        albumArtElement.style.display = "block"; // Show the album art
                        albumArtLink.href = `https://open.spotify.com/track/${spotifyData.track_id}`; // Set the song's Spotify link
                        separatorElement.style.display = "block"; // Show the separator when a song is playing

                        // Extract colors and set gradient background with smooth transition
                        albumArtElement.onload = function () {
                            try {
                                const colorThief = new ColorThief();

                                // Check if image is fully loaded
                                if (albumArtElement.naturalWidth > 0 && albumArtElement.naturalHeight > 0) {
                                    const dominantColor = colorThief.getColor(albumArtElement);
                                    const palette = colorThief.getPalette(albumArtElement, 2);

                                    // Check if palette data is valid
                                    if (dominantColor && palette && palette.length > 1) {
                                        const gradient = `linear-gradient(135deg, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}), rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}))`;

                                        // Apply smooth transition to background
                                        document.body.style.background = gradient;
                                    } else {
                                        console.error("Invalid palette data. Applying fallback background.");
                                        document.body.style.background = "#2c2c2c"; // Fallback background
                                    }
                                } else {
                                    console.error("Invalid image dimensions. Applying fallback background.");
                                    document.body.style.background = "#2c2c2c"; // Fallback background
                                }
                            } catch (error) {
                                console.error("Error extracting colors from the image:", error);
                                document.body.style.background = "#2c2c2c"; // Fallback background
                            }
                        };

                        // Handle errors while loading the album art
                        albumArtElement.onerror = function () {
                            console.error("Error loading album art image. Applying fallback background.");
                            document.body.style.background = "#2c2c2c"; // Fallback background
                            activityElement.textContent = "Failed to load album art.";
                            separatorElement.style.display = "none"; // Hide the separator if the image fails to load
                        };
                    } else {
                        activityElement.textContent = "offline :(";
                        albumArtElement.style.display = "none"; // Hide the album art if not listening to Spotify
                        separatorElement.style.display = "none"; // Hide the separator when no song is playing
                        document.body.style.background = "#2c2c2c"; // Fallback background when offline
                    }
                }
            };
        }

        // Reset song data to handle new song updates
        function resetSongData() {
            const albumArtElement = document.getElementById("albumArt");
            const albumArtLink = document.getElementById("albumArtLink"); // Reset anchor element
            const activityElement = document.getElementById("activity");
            const separatorElement = document.querySelector(".separator");

            // Clear the album art, activity text, and anchor href
            albumArtElement.src = "";
            albumArtLink.href = "#";
            albumArtElement.style.display = "none";
            activityElement.textContent = "";

            // Hide the separator
            separatorElement.style.display = "none";

            // Reset the background color
            document.body.style.background = "#2c2c2c";
        }

        // Start the WebSocket connection after the DOM is fully loaded
        document.addEventListener("DOMContentLoaded", () => {
            connectToLanyard();
        });