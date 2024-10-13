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
  if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
    console.log("Received data:", data.d);
    const statusElement = document.getElementById("status");
    const activityElement = document.getElementById("activity");

    statusElement.textContent = `Status: ${data.d.status}`;
    
    if (data.d.activities && data.d.activities.length > 0) {
      activityElement.textContent = `Activity: ${data.d.activities[0].name}`;
    } else {
      activityElement.textContent = "No activity";
    }
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};
