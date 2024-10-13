const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "712648730423197697",
      },
    })
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
    console.log(data.d);
  }
};
