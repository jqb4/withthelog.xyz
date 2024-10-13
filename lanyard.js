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
  console.log("Full WebSocket message received:", data); // Log everything

  // Specifically check for presence data
  if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
    console.log("Presence data:", data.d); // Log the relevant presence data
    const presence = data.d;

    const statusElement = document.getElementById("status");
    const activityElement = document.getElementById("activity");

    statusElement.textContent = `Status: ${presence.status || "No status"}`;
    
    if (presence.activities && presence.activities.length > 0) {
      activityElement.textContent = `Activity: ${presence.activities[0].name}`;
    } else {
      activityElement.textContent = "No activity detected";
    }
  } else {
    console.log("Unknown data format or no presence updates.");
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};
