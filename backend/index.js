import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // allow frontend to connect
});

io.on("connection", (socket) => {
  console.log("🔌 Player connected:", socket.id);

  // Broadcast chat messages
  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);
  });

  // Broadcast hints
  socket.on("submit-hint", (hint) => {
    io.emit("submit-hint", hint);
  });

  // Broadcast votes
  socket.on("vote", (vote) => {
    io.emit("vote", vote);
  });

  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("✅ Server running on http://localhost:4000");
});
