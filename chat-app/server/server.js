const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sockets = [];

wss.on("connection", (ws) => {
  sockets.push(ws);

  ws.on("message", (message) => {
    sockets.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    sockets = sockets.filter((client) => client !== ws);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on ws://localhost:3001");
});
