const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

// test join
socket.emit("join", { room: "testRoom", player: "Harsh" });

socket.on("joined", (msg) => {
  console.log("✅ Server says:", msg);
});
