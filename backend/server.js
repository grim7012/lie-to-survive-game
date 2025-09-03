// // const express = require("express");
// // const http = require("http");
// // const { Server } = require("socket.io");
// // const cors = require("cors");

// // const app = express();
// // app.use(cors({ origin: "*" }));
// // const server = http.createServer(app);
// // const io = new Server(server, { cors: { origin: "*" } });

// // const WORDS = ["Apple", "Banana", "Cat", "Dog", "Car", "Tree", "River", "Ocean", "Mountain", "Book", "Computer", "Phone", "Coffee", "Pizza", "Guitar"];

// // // Store rooms and players
// // const rooms = new Map();

// // function startRound(roomId) {
// //   const room = rooms.get(roomId);
  
// //   if (!room || room.players.length < 3) return;
  
// //   room.hints = [];
// //   room.votes = [];
// //   room.gameState = "hint";

// //   // Pick secret word & liar
// //   room.secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
// //   const liar = room.players[Math.floor(Math.random() * room.players.length)];
// //   room.liarId = liar.id;

// //   // Notify players individually about secret word
// //   room.players.forEach((p) => {
// //     io.to(p.id).emit("round-start", {
// //       secretWord: p.id === room.liarId ? "" : room.secretWord,
// //       isLiar: p.id === room.liarId,
// //       round: room.round,
// //       totalRounds: room.totalRounds
// //     });
// //   });

// //   // Notify all players phase started
// //   io.to(roomId).emit("room-update", {
// //     roomId,
// //     players: room.players,
// //     gameState: room.gameState,
// //     phase: "hint",
// //     round: room.round,
// //     totalRounds: room.totalRounds
// //   });
// // }

// // io.on("connection", (socket) => {
// //   console.log("Player connected:", socket.id);

// //   socket.on("join-room", (data, cb) => {
// //     console.log("join-room received:", data);
    
// //     const { roomId, name, color } = data;
    
// //     // Create room if it doesn't exist
// //     if (!rooms.has(roomId)) {
// //       rooms.set(roomId, {
// //         players: [],
// //         gameState: "waiting",
// //         secretWord: null,
// //         liarId: null,
// //         hints: [],
// //         votes: [],
// //         round: 1,
// //         totalRounds: 5
// //       });
// //       console.log("Created new room:", roomId);
// //     }
    
// //     const room = rooms.get(roomId);
    
// //     // Check if player already exists
// //     const existingPlayerIndex = room.players.findIndex(player => player.id === socket.id);
// //     if (existingPlayerIndex !== -1) {
// //       console.log("Player already in room, updating info");
// //       room.players[existingPlayerIndex].name = name;
// //       room.players[existingPlayerIndex].color = color;
// //     } else {
// //       // Add new player to room
// //       const player = {
// //         id: socket.id,
// //         name,
// //         color,
// //         score: 0,
// //         isHost: room.players.length === 0
// //       };
// //       room.players.push(player);
// //       console.log(`Player ${name} joined room ${roomId}. Total players: ${room.players.length}`);
// //     }
    
// //     // Join socket room
// //     socket.join(roomId);
    
// //     // Notify player they joined successfully
// //     cb({ ok: true, roomId });
    
// //     // Broadcast updated player list to everyone in the room
// //     io.to(roomId).emit("room-update", {
// //       roomId,
// //       players: room.players,
// //       gameState: room.gameState,
// //       phase: room.gameState,
// //       round: room.round,
// //       totalRounds: room.totalRounds
// //     });
// //   });

// //   socket.on("start-game", (data, cb) => {
// //     console.log("start-game received:", data);
// //     const { roomId } = data;
    
// //     if (!rooms.has(roomId)) {
// //       cb({ ok: false, error: "Room not found" });
// //       return;
// //     }
    
// //     const room = rooms.get(roomId);
    
// //     // Check if the requesting player is the host
// //     const player = room.players.find(p => p.id === socket.id);
// //     if (!player || !player.isHost) {
// //       cb({ ok: false, error: "Only the host can start the game" });
// //       return;
// //     }
    
// //     // Check if there are enough players
// //     if (room.players.length < 3) {
// //       cb({ ok: false, error: "Need at least 3 players to start" });
// //       return;
// //     }

// //     // Reset scores and round state
// //     room.players.forEach(p => p.score = 0);
// //     room.round = 1;
// //     room.gameState = "playing";
    
// //     console.log(`Game starting in room ${roomId} with ${room.players.length} players`);
    
// //     // Start first round
// //     startRound(roomId);
    
// //     cb({ ok: true });
// //   });

// //   socket.on("submit-hint", ({ roomId, hint }, cb) => {
// //     const room = rooms.get(roomId);
// //     if (!room || room.gameState !== "hint") return cb({ ok: false, error: "Not in hint phase" });

// //     // Check if player already submitted a hint
// //     const existingHintIndex = room.hints.findIndex(h => h.playerId === socket.id);
    
// //     if (existingHintIndex !== -1) {
// //       // Update existing hint
// //       room.hints[existingHintIndex].hint = hint;
// //     } else {
// //       // Add new hint
// //       const player = room.players.find(p => p.id === socket.id);
// //       room.hints.push({
// //         id: Date.now().toString(),
// //         playerId: socket.id,
// //         playerName: player?.name || "Unknown",
// //         playerColor: player?.color || "#3b82f6",
// //         hint: hint,
// //         votes: 0
// //       });
// //     }

// //     // Check if all players submitted hints
// //     if (room.hints.length === room.players.length) {
// //       room.gameState = "voting";
// //       io.to(roomId).emit("hints-ready", room.hints);
      
// //       // Update room state for new players
// //       io.to(roomId).emit("room-update", {
// //         roomId,
// //         players: room.players,
// //         gameState: room.gameState,
// //         phase: "voting",
// //         round: room.round,
// //         totalRounds: room.totalRounds
// //       });
// //     }
    
// //     cb({ ok: true });
// //   });

// //   socket.on("submit-vote", ({ roomId, targetId }, cb) => {
// //     const room = rooms.get(roomId);
// //     if (!room || room.gameState !== "voting") return cb({ ok: false, error: "Not in voting phase" });

// //     // Remove any previous vote from this player
// //     room.votes = room.votes.filter(v => v.voter !== socket.id);
    
// //     // Add new vote
// //     room.votes.push({ voter: socket.id, target: targetId });

// //     // Check if all players voted
// //     if (room.votes.length === room.players.length) {
// //       // Calculate votes for each hint
// //       room.hints.forEach(hint => {
// //         hint.votes = room.votes.filter(v => v.target === hint.playerId).length;
// //       });

// //       // Determine if liar was caught
// //       const liarCaught = room.votes.some(v => v.target === room.liarId);
      
// //       // Update scores
// //       room.players.forEach(player => {
// //         if (player.id === room.liarId) {
// //           // Liar gets points if not caught
// //           if (!liarCaught) player.score += 15;
// //         } else {
// //           // Other players get points if liar is caught
// //           if (liarCaught) player.score += 10;
// //         }
// //       });

// //       // Send round results
// //       io.to(roomId).emit("round-results", {
// //         liarId: room.liarId,
// //         hints: room.hints,
// //         votes: room.votes,
// //         secretWord: room.secretWord,
// //         liarCaught: liarCaught
// //       });

// //       room.gameState = "reveal";
      
// //       // After reveal, start next round or end game
// //       setTimeout(() => {
// //         room.round++;
// //         if (room.round <= room.totalRounds) {
// //           startRound(roomId);
// //         } else {
// //           io.to(roomId).emit("game-over", { 
// //             players: room.players,
// //             finalScores: true
// //           });
// //           room.gameState = "waiting";
// //         }
// //       }, 8000);
// //     }
    
// //     cb({ ok: true });
// //   });

// //   socket.on("chat", (data, cb) => {
// //     const { roomId, message } = data;
    
// //     if (!rooms.has(roomId)) {
// //       if (cb) cb({ ok: false, error: "Room not found" });
// //       return;
// //     }
    
// //     const room = rooms.get(roomId);
// //     const player = room.players.find(p => p.id === socket.id);
    
// //     if (!player) {
// //       if (cb) cb({ ok: false, error: "Player not in room" });
// //       return;
// //     }
    
// //     // Broadcast chat to room
// //     io.to(roomId).emit("chat", {
// //       id: Date.now().toString(),
// //       playerId: socket.id,
// //       playerName: player.name,
// //       playerColor: player.color,
// //       message,
// //       timestamp: new Date().toISOString()
// //     });
    
// //     if (cb) cb({ ok: true });
// //   });

// //   socket.on("leave-room", (data) => {
// //     const { roomId } = data;
    
// //     if (rooms.has(roomId)) {
// //       const room = rooms.get(roomId);
// //       const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
// //       if (playerIndex !== -1) {
// //         const playerName = room.players[playerIndex].name;
// //         room.players.splice(playerIndex, 1);
// //         console.log(`Player ${playerName} left room ${roomId}`);
        
// //         // If room is empty, delete it
// //         if (room.players.length === 0) {
// //           rooms.delete(roomId);
// //           console.log(`Room ${roomId} deleted (empty)`);
// //         } else {
// //           // Update host if needed (first player becomes host)
// //           if (room.players.length > 0 && !room.players[0].isHost) {
// //             room.players[0].isHost = true;
// //           }
          
// //           // Broadcast updated player list
// //           io.to(roomId).emit("room-update", {
// //             roomId,
// //             players: room.players,
// //             gameState: room.gameState,
// //             phase: room.gameState,
// //             round: room.round,
// //             totalRounds: room.totalRounds
// //           });
// //         }
// //       }
// //     }
    
// //     socket.leave(roomId);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("Player disconnected:", socket.id);
    
// //     // Remove player from all rooms
// //     rooms.forEach((room, roomId) => {
// //       const playerIndex = room.players.findIndex(player => player.id === socket.id);
      
// //       if (playerIndex !== -1) {
// //         const playerName = room.players[playerIndex].name;
// //         room.players.splice(playerIndex, 1);
// //         console.log(`Player ${playerName} disconnected from room ${roomId}`);
        
// //         // If room is empty, delete it
// //         if (room.players.length === 0) {
// //           rooms.delete(roomId);
// //           console.log(`Room ${roomId} deleted (empty)`);
// //         } else {
// //           // Update host if needed (first player becomes host)
// //           if (room.players.length > 0 && !room.players[0].isHost) {
// //             room.players[0].isHost = true;
// //           }
          
// //           // Broadcast updated player list
// //           io.to(roomId).emit("room-update", {
// //             roomId,
// //             players: room.players,
// //             gameState: room.gameState,
// //             phase: room.gameState,
// //             round: room.round,
// //             totalRounds: room.totalRounds
// //           });
// //         }
// //       }
// //     });
// //   });
// // });

// // const PORT = process.env.PORT || 4000;
// // server.listen(PORT, () => {
// //   console.log(`Server listening on http://localhost:${PORT}`);
// // });
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors({ origin: "*" }));
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// const WORDS = [
//   "Apple", "Banana", "Cat", "Dog", "Car", "Tree",
//   "River", "Ocean", "Mountain", "Book", "Computer",
//   "Phone", "Coffee", "Pizza", "Guitar"
// ];

// const rooms = new Map(); // roomId -> { players, state, ... }

// // ---------------- HELPERS ----------------
// function pickWord() {
//   return WORDS[Math.floor(Math.random() * WORDS.length)];
// }

// function broadcastRoomUpdate(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   io.to(roomId).emit("room-update", {
//     roomId,
//     players: room.players,
//     gameState: room.gameState,
//     round: room.round,
//     totalRounds: room.totalRounds,
//   });
// }

// function startTimer(roomId, duration, onExpire) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   room.timeLeft = duration;
//   clearInterval(room.timer);

//   room.timer = setInterval(() => {
//     if (room.timeLeft > 0) {
//       room.timeLeft--;
//       io.to(roomId).emit("timer-update", { timeLeft: room.timeLeft });
//     } else {
//       clearInterval(room.timer);
//       if (onExpire) onExpire();
//     }
//   }, 1000);
// }

// function startRound(roomId) {
//   const room = rooms.get(roomId);
//   if (!room || room.players.length < 3) return;

//   room.hints = [];
//   room.votes = [];
//   room.gameState = "hint";
//   room.secretWord = pickWord();
//   room.liarId = room.players[Math.floor(Math.random() * room.players.length)].id;

//   // notify each player with their context
//   room.players.forEach((p) => {
//     io.to(p.id).emit("round-start", {
//       secretWord: p.id === room.liarId ? "" : room.secretWord,
//       isLiar: p.id === room.liarId,
//       round: room.round,
//       totalRounds: room.totalRounds,
//     });
//   });

//   broadcastRoomUpdate(roomId);

//   // Start hint timer (e.g. 30s)
//   startTimer(roomId, 30, () => {
//     // If not all hints submitted, force move to voting
//     if (room.gameState === "hint") {
//       room.gameState = "voting";
//       io.to(roomId).emit("hints-ready", room.hints);
//       broadcastRoomUpdate(roomId);
//       startTimer(roomId, 20, () => endVoting(roomId));
//     }
//   });
// }

// function endVoting(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   // count votes
//   room.hints.forEach((hint) => {
//     hint.votes = room.votes.filter((v) => v.target === hint.playerId).length;
//   });

//   const liarCaught = room.votes.some((v) => v.target === room.liarId);
//   room.gameState = liarCaught ? "guess" : "reveal";

//   if (!liarCaught) {
//     // liar survived
//     room.players.forEach((p) => {
//       if (p.id === room.liarId) p.score += 15;
//     });

//     io.to(roomId).emit("round-results", {
//       liarId: room.liarId,
//       liarCaught,
//       hints: room.hints,
//       votes: room.votes,
//       secretWord: room.secretWord,
//       players: room.players,
//       round: room.round,
//       totalRounds: room.totalRounds,
//     });

//     nextRoundOrEnd(roomId);
//   } else {
//     // liar caught → allow liar guess
//     io.to(roomId).emit("round-results", {
//       liarId: room.liarId,
//       liarCaught,
//       hints: room.hints,
//       votes: room.votes,
//       secretWord: null,
//       players: room.players,
//       round: room.round,
//       totalRounds: room.totalRounds,
//     });

//     io.to(room.liarId).emit("guess-word", {
//       message: "You were caught! Try guessing the word.",
//     });

//     // Start guess timer (15s)
//     startTimer(roomId, 15, () => {
//       // If liar doesn't guess in time → reveal
//       if (room.gameState === "guess") {
//         room.players.forEach((p) => {
//           if (p.id !== room.liarId) p.score += 10;
//         });
//         io.to(roomId).emit("guess-result", {
//           liarId: room.liarId,
//           guess: null,
//           correct: false,
//           secretWord: room.secretWord,
//           players: room.players,
//         });
//         nextRoundOrEnd(roomId);
//       }
//     });
//   }
// }

// function nextRoundOrEnd(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   setTimeout(() => {
//     room.round++;
//     if (room.round <= room.totalRounds) {
//       startRound(roomId);
//     } else {
//       room.gameState = "waiting";
//       io.to(roomId).emit("game-over", {
//         players: room.players,
//         finalScores: true,
//       });
//     }
//   }, 8000);
// }

// // ---------------- SOCKET HANDLERS ----------------
// io.on("connection", (socket) => {
//   console.log("Player connected:", socket.id);

//   socket.on("join-room", (data, cb) => {
//     const { roomId, name, color } = data;

//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, {
//         players: [],
//         gameState: "waiting",
//         secretWord: null,
//         liarId: null,
//         hints: [],
//         votes: [],
//         round: 1,
//         totalRounds: 5,
//         timeLeft: 0,
//         timer: null,
//       });
//     }

//     const room = rooms.get(roomId);
//     const player = {
//       id: socket.id,
//       name,
//       color,
//       score: 0,
//       isHost: room.players.length === 0,
//     };
//     room.players.push(player);

//     socket.join(roomId);
//     cb({ ok: true, roomId });

//     broadcastRoomUpdate(roomId);
//   });

//   socket.on("start-game", ({ roomId }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room) return cb({ ok: false, error: "Room not found" });

//     const host = room.players.find((p) => p.id === socket.id);
//     if (!host || !host.isHost) return cb({ ok: false, error: "Only host can start" });
//     if (room.players.length < 3) return cb({ ok: false, error: "Need at least 3 players" });

//     room.players.forEach((p) => (p.score = 0));
//     room.round = 1;
//     room.gameState = "playing";

//     io.to(roomId).emit("game-started", { roomId });
//     startRound(roomId);
//     cb({ ok: true });
//   });

//   socket.on("submit-hint", ({ roomId, hint }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room || room.gameState !== "hint") return cb({ ok: false });

//     const player = room.players.find((p) => p.id === socket.id);
//     if (!player) return cb({ ok: false });

//     const existing = room.hints.find((h) => h.playerId === socket.id);
//     if (existing) existing.hint = hint;
//     else {
//       room.hints.push({
//         id: Date.now().toString(),
//         playerId: socket.id,
//         playerName: player.name,
//         playerColor: player.color,
//         hint,
//         votes: 0,
//       });
//     }

//     if (room.hints.length === room.players.length) {
//       room.gameState = "voting";
//       io.to(roomId).emit("hints-ready", room.hints);
//       broadcastRoomUpdate(roomId);
//       startTimer(roomId, 20, () => endVoting(roomId));
//     }
//     cb({ ok: true });
//   });

//   socket.on("submit-vote", ({ roomId, targetId }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room || room.gameState !== "voting") return cb({ ok: false });

//     room.votes = room.votes.filter((v) => v.voter !== socket.id);
//     room.votes.push({ voter: socket.id, target: targetId });

//     if (room.votes.length === room.players.length) {
//       endVoting(roomId);
//     }
//     cb({ ok: true });
//   });

//   socket.on("liar-guess", ({ roomId, guess }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room || room.gameState !== "guess") return cb({ ok: false });

//     const liar = room.players.find((p) => p.id === room.liarId);
//     if (!liar) return cb({ ok: false });

//     const correct = guess.toLowerCase() === room.secretWord.toLowerCase();
//     if (correct) liar.score += 10;
//     else {
//       room.players.forEach((p) => {
//         if (p.id !== room.liarId) p.score += 10;
//       });
//     }

//     room.gameState = "reveal";
//     io.to(roomId).emit("guess-result", {
//       liarId: room.liarId,
//       guess,
//       correct,
//       secretWord: room.secretWord,
//       players: room.players,
//     });

//     nextRoundOrEnd(roomId);
//     cb({ ok: true });
//   });

//   socket.on("chat", ({ roomId, message }) => {
//     const room = rooms.get(roomId);
//     const player = room?.players.find((p) => p.id === socket.id);
//     if (!room || !player) return;

//     io.to(roomId).emit("chat", {
//       id: Date.now().toString(),
//       playerId: player.id,
//       playerName: player.name,
//       playerColor: player.color,
//       message,
//       timestamp: new Date().toISOString(),
//     });
//   });

//   socket.on("disconnect", () => {
//     rooms.forEach((room, roomId) => {
//       const idx = room.players.findIndex((p) => p.id === socket.id);
//       if (idx !== -1) {
//         room.players.splice(idx, 1);
//         if (room.players.length === 0) {
//           clearInterval(room.timer);
//           rooms.delete(roomId);
//         } else {
//           if (!room.players.some((p) => p.isHost)) room.players[0].isHost = true;
//           broadcastRoomUpdate(roomId);
//         }
//       }
//     });
//   });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, 'build')));

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  } 
});


const WORDS = [
  "Apple", "Banana", "Cat", "Dog", "Car", "Tree",
  "River", "Ocean", "Mountain", "Book", "Computer",
  "Phone", "Coffee", "Pizza", "Guitar"
];

const rooms = new Map();
const connectedPlayers = new Map(); // Track connected players

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function broadcastRoomUpdate(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  io.to(roomId).emit("room-update", {
    players: room.players,
    gameState: room.gameState,
    round: room.round,
    totalRounds: room.totalRounds,
    timeLeft: room.timeLeft
  });
}

function startTimer(roomId, duration, onExpire) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.timeLeft = duration;
  clearInterval(room.timer);

  room.timer = setInterval(() => {
    if (room.timeLeft > 0) {
      room.timeLeft--;
      io.to(roomId).emit("timer-update", { timeLeft: room.timeLeft });
    } else {
      clearInterval(room.timer);
      if (onExpire) onExpire();
    }
  }, 1000);
}

function startRound(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.players.length < 3) return;

  room.hints = [];
  room.votes = [];
  room.gameState = "hint";
  room.secretWord = pickWord();
  room.liarId = room.players[Math.floor(Math.random() * room.players.length)].id;

  room.players.forEach((p) => {
    io.to(p.id).emit("round-start", {
      secretWord: p.id === room.liarId ? "" : room.secretWord,
      isLiar: p.id === room.liarId,
      round: room.round,
      totalRounds: room.totalRounds,
    });
  });

  broadcastRoomUpdate(roomId);

  startTimer(roomId, 30, () => {
    if (room.gameState === "hint") {
      room.gameState = "voting";
      io.to(roomId).emit("hints-ready", room.hints);
      broadcastRoomUpdate(roomId);
      startTimer(roomId, 20, () => endVoting(roomId));
    }
  });
}

// In server.js, update the endVoting function to calculate voting results
function endVoting(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.hints.forEach((hint) => {
    hint.votes = room.votes.filter((v) => v.target === hint.playerId).length;
  });

  const liarCaught = room.votes.some((v) => v.target === room.liarId);
  room.gameState = "reveal";

  // Calculate voting results for each player
  room.players.forEach((player) => {
    // Check if player voted correctly (voted for the liar)
    const playerVote = room.votes.find(v => v.voter === player.id);
    player.votedCorrectly = playerVote ? playerVote.target === room.liarId : false;
    
    // Calculate points gained this round
    if (player.id === room.liarId) {
      // Liar gets points if not caught
      player.pointsGained = liarCaught ? 0 : 15;
      player.score += player.pointsGained;
    } else {
      // Non-liars get points if they voted correctly or if liar was caught
      player.pointsGained = liarCaught ? 10 : (player.votedCorrectly ? 10 : 0);
      player.score += player.pointsGained;
    }
    
    // Mark if player was the liar
    player.wasLiar = player.id === room.liarId;
  });

  io.to(roomId).emit("round-results", {
    liarId: room.liarId,
    liarCaught,
    hints: room.hints,
    votes: room.votes,
    secretWord: room.secretWord,
    players: room.players,
    isGameEnd: room.round >= room.totalRounds
  });

  broadcastRoomUpdate(roomId);
  
  // Move to next round after a delay
  setTimeout(() => {
    nextRoundOrEnd(roomId);
  }, 8000);
}

function nextRoundOrEnd(roomId) { // Make sure roomId is passed as parameter
  const room = rooms.get(roomId);
  if (!room) return;

  room.round++;
  if (room.round <= room.totalRounds) {
    startRound(roomId);
  } else {
    room.gameState = "waiting";
    
    // Find the winner
    const winner = room.players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    
    // Emit game-over event with roomId in scope
    io.to(roomId).emit("game-over", {
      players: room.players,
      finalScores: true,
      isGameEnd: true,
      winner: winner,
      roomId: roomId // Include roomId in the event data if needed
    });
    
    broadcastRoomUpdate(roomId);
  }
}


// // Update the game-over event to include final scores
// io.to(roomId).emit("game-over", {
//   players: room.players,
//   finalScores: true,
//   isGameEnd: true,
//   winner: room.players.reduce((prev, current) => 
//     prev.score > current.score ? prev : current
//   )
// });


function nextRoundOrEnd(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.round++;
  if (room.round <= room.totalRounds) {
    startRound(roomId);
  } else {
    room.gameState = "waiting";
    io.to(roomId).emit("game-over", {
      players: room.players,
      finalScores: true,
    });
    broadcastRoomUpdate(roomId);
  }
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  connectedPlayers.set(socket.id, { socket, roomId: null });

  socket.on("join-room", (data, cb) => {
    const { roomId, name, color } = data;

    // Check if player is already in a room
    const existingRoomId = connectedPlayers.get(socket.id)?.roomId;
    if (existingRoomId && existingRoomId !== roomId) {
      // Leave previous room
      socket.leave(existingRoomId);
      const prevRoom = rooms.get(existingRoomId);
      if (prevRoom) {
        prevRoom.players = prevRoom.players.filter(p => p.id !== socket.id);
        if (prevRoom.players.length === 0) {
          rooms.delete(existingRoomId);
        } else {
          broadcastRoomUpdate(existingRoomId);
        }
      }
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        players: [],
        gameState: "waiting",
        secretWord: null,
        liarId: null,
        hints: [],
        votes: [],
        round: 1,
        totalRounds: 5,
        timeLeft: 0,
        timer: null,
      });
    }

    const room = rooms.get(roomId);
    
    // Check if player already exists in this room
    const existingPlayerIndex = room.players.findIndex(p => p.id === socket.id);
    if (existingPlayerIndex !== -1) {
      // Update existing player
      room.players[existingPlayerIndex].name = name;
      room.players[existingPlayerIndex].color = color;
    } else {
      // Add new player
      const player = {
        id: socket.id,
        name,
        color,
        score: 0,
        isHost: room.players.length === 0,
      };
      room.players.push(player);
    }

    socket.join(roomId);
    connectedPlayers.set(socket.id, { socket, roomId });
    
    cb({ ok: true, roomId });
    broadcastRoomUpdate(roomId);
  });

  socket.on("start-game", ({ roomId }, cb) => {
    const room = rooms.get(roomId);
    if (!room) return cb({ ok: false, error: "Room not found" });

    const host = room.players.find((p) => p.id === socket.id);
    if (!host || !host.isHost) return cb({ ok: false, error: "Only host can start" });
    if (room.players.length < 3) return cb({ ok: false, error: "Need at least 3 players" });

    room.players.forEach((p) => (p.score = 0));
    room.round = 1;
    room.gameState = "playing";

    io.to(roomId).emit("game-started", { roomId });
    startRound(roomId);
    cb({ ok: true });
  });

  socket.on("submit-hint", ({ roomId, hint }, cb) => {
    const room = rooms.get(roomId);
    if (!room || room.gameState !== "hint") return cb({ ok: false });

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return cb({ ok: false });

    const existing = room.hints.find((h) => h.playerId === socket.id);
    if (existing) {
      existing.hint = hint;
    } else {
      room.hints.push({
        id: Date.now().toString(),
        playerId: socket.id,
        playerName: player.name,
        playerColor: player.color,
        hint,
        votes: 0,
      });
    }

    if (room.hints.length === room.players.length) {
      room.gameState = "voting";
      io.to(roomId).emit("hints-ready", room.hints);
      broadcastRoomUpdate(roomId);
      startTimer(roomId, 20, () => endVoting(roomId));
    }
    cb({ ok: true });
  });

  socket.on("submit-vote", ({ roomId, targetId }, cb) => {
  const room = rooms.get(roomId);
  if (!room || room.gameState !== "voting") return cb({ ok: false });

  room.votes = room.votes.filter((v) => v.voter !== socket.id);
  room.votes.push({ voter: socket.id, target: targetId });

  if (room.votes.length === room.players.length) {
    endVoting(roomId); // Pass roomId here
  }
  cb({ ok: true });
});

  // In server.js, update the chat event handler
socket.on("chat", ({ roomId, message }, cb) => {
  const room = rooms.get(roomId);
  const player = room?.players.find((p) => p.id === socket.id);
  if (!room || !player) return cb({ ok: false, error: "Not in room" });

  const chatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
    playerId: player.id,
    playerName: player.name,
    playerColor: player.color,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  if (chatMessage.message) {
    io.to(roomId).emit("chat", chatMessage);
    cb({ ok: true });
  } else {
    cb({ ok: false, error: "Message cannot be empty" });
  }
});

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    
    const playerInfo = connectedPlayers.get(socket.id);
    if (playerInfo && playerInfo.roomId) {
      const room = rooms.get(playerInfo.roomId);
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        if (room.players.length === 0) {
          clearInterval(room.timer);
          rooms.delete(playerInfo.roomId);
        } else {
          if (!room.players.some((p) => p.isHost)) room.players[0].isHost = true;
          broadcastRoomUpdate(playerInfo.roomId);
        }
      }
    }
    
    connectedPlayers.delete(socket.id);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.static(path.join(__dirname, 'build')));

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// const WORDS = [
//   "Apple", "Banana", "Cat", "Dog", "Car", "Tree",
//   "River", "Ocean", "Mountain", "Book", "Computer",
//   "Phone", "Coffee", "Pizza", "Guitar"
// ];

// const rooms = new Map();

// function pickWord() {
//   return WORDS[Math.floor(Math.random() * WORDS.length)];
// }

// function broadcastRoomUpdate(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   io.to(roomId).emit("room-update", {
//     players: room.players,
//     gameState: room.gameState,
//     round: room.round,
//     totalRounds: room.totalRounds,
//     timeLeft: room.timeLeft
//   });
// }

// function startTimer(roomId, duration, onExpire) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   room.timeLeft = duration;
//   clearInterval(room.timer);

//   room.timer = setInterval(() => {
//     if (room.timeLeft > 0) {
//       room.timeLeft--;
//       io.to(roomId).emit("timer-update", { timeLeft: room.timeLeft });
//     } else {
//       clearInterval(room.timer);
//       if (onExpire) onExpire();
//     }
//   }, 1000);
// }

// function startRound(roomId) {
//   const room = rooms.get(roomId);
//   if (!room || room.players.length < 3) return;

//   room.hints = [];
//   room.votes = [];
//   room.gameState = "hint";
//   room.secretWord = pickWord();
//   room.liarId = room.players[Math.floor(Math.random() * room.players.length)].id;

//   room.players.forEach((p) => {
//     io.to(p.id).emit("round-start", {
//       secretWord: p.id === room.liarId ? "" : room.secretWord,
//       isLiar: p.id === room.liarId,
//       round: room.round,
//       totalRounds: room.totalRounds,
//     });
//   });

//   broadcastRoomUpdate(roomId);

//   startTimer(roomId, 30, () => {
//     if (room.gameState === "hint") {
//       room.gameState = "voting";
//       io.to(roomId).emit("hints-ready", room.hints);
//       broadcastRoomUpdate(roomId);
//       startTimer(roomId, 20, () => endVoting(roomId));
//     }
//   });
// }

// function endVoting(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   room.hints.forEach((hint) => {
//     hint.votes = room.votes.filter((v) => v.target === hint.playerId).length;
//   });

//   const liarCaught = room.votes.some((v) => v.target === room.liarId);
//   room.gameState = "reveal";

//   // Update scores
//   if (liarCaught) {
//     // Liar was caught - all non-liars get points
//     room.players.forEach((p) => {
//       if (p.id !== room.liarId) p.score += 10;
//     });
//   } else {
//     // Liar wasn't caught - liar gets points
//     room.players.forEach((p) => {
//       if (p.id === room.liarId) p.score += 15;
//     });
//   }

//   io.to(roomId).emit("round-results", {
//     liarId: room.liarId,
//     liarCaught,
//     hints: room.hints,
//     votes: room.votes,
//     secretWord: room.secretWord,
//     players: room.players
//   });

//   broadcastRoomUpdate(roomId);
  
//   // Move to next round after a delay
//   setTimeout(() => {
//     nextRoundOrEnd(roomId);
//   }, 8000);
// }

// function nextRoundOrEnd(roomId) {
//   const room = rooms.get(roomId);
//   if (!room) return;

//   room.round++;
//   if (room.round <= room.totalRounds) {
//     startRound(roomId);
//   } else {
//     room.gameState = "waiting";
//     io.to(roomId).emit("game-over", {
//       players: room.players,
//       finalScores: true,
//     });
//     broadcastRoomUpdate(roomId);
//   }
// }

// io.on("connection", (socket) => {
//   console.log("Player connected:", socket.id);

//   socket.on("join-room", (data, cb) => {
//     const { roomId, name, color } = data;

//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, {
//         players: [],
//         gameState: "waiting",
//         secretWord: null,
//         liarId: null,
//         hints: [],
//         votes: [],
//         round: 1,
//         totalRounds: 5,
//         timeLeft: 0,
//         timer: null,
//       });
//     }

//     const room = rooms.get(roomId);
    
//     // Check if player already exists in room
//     const existingPlayer = room.players.find(p => p.id === socket.id);
//     if (existingPlayer) {
//       return cb({ ok: false, error: "Player already in room" });
//     }

//     const player = {
//       id: socket.id,
//       name,
//       color,
//       score: 0,
//       isHost: room.players.length === 0,
//     };
//     room.players.push(player);

//     socket.join(roomId);
//     cb({ ok: true, roomId });

//     broadcastRoomUpdate(roomId);
//   });

//   socket.on("start-game", ({ roomId }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room) return cb({ ok: false, error: "Room not found" });

//     const host = room.players.find((p) => p.id === socket.id);
//     if (!host || !host.isHost) return cb({ ok: false, error: "Only host can start" });
//     if (room.players.length < 3) return cb({ ok: false, error: "Need at least 3 players" });

//     room.players.forEach((p) => (p.score = 0));
//     room.round = 1;
//     room.gameState = "playing";

//     io.to(roomId).emit("game-started", { roomId });
//     startRound(roomId);
//     cb({ ok: true });
//   });

//   socket.on("submit-hint", ({ roomId, hint }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room || room.gameState !== "hint") return cb({ ok: false });

//     const player = room.players.find((p) => p.id === socket.id);
//     if (!player) return cb({ ok: false });

//     const existing = room.hints.find((h) => h.playerId === socket.id);
//     if (existing) {
//       existing.hint = hint;
//     } else {
//       room.hints.push({
//         id: Date.now().toString(),
//         playerId: socket.id,
//         playerName: player.name,
//         playerColor: player.color,
//         hint,
//         votes: 0,
//       });
//     }

//     if (room.hints.length === room.players.length) {
//       room.gameState = "voting";
//       io.to(roomId).emit("hints-ready", room.hints);
//       broadcastRoomUpdate(roomId);
//       startTimer(roomId, 20, () => endVoting(roomId));
//     }
//     cb({ ok: true });
//   });

//   socket.on("submit-vote", ({ roomId, targetId }, cb) => {
//     const room = rooms.get(roomId);
//     if (!room || room.gameState !== "voting") return cb({ ok: false });

//     room.votes = room.votes.filter((v) => v.voter !== socket.id);
//     room.votes.push({ voter: socket.id, target: targetId });

//     if (room.votes.length === room.players.length) {
//       endVoting(roomId);
//     }
//     cb({ ok: true });
//   });

//   socket.on("chat", ({ roomId, message }, cb) => {
//     const room = rooms.get(roomId);
//     const player = room?.players.find((p) => p.id === socket.id);
//     if (!room || !player) return cb({ ok: false });

//     const chatMessage = {
//       id: Date.now().toString(),
//       playerId: player.id,
//       playerName: player.name,
//       playerColor: player.color,
//       message,
//       timestamp: new Date(),
//     };

//     io.to(roomId).emit("chat", chatMessage);
//     cb({ ok: true });
//   });

//   socket.on("disconnect", () => {
//     rooms.forEach((room, roomId) => {
//       const idx = room.players.findIndex((p) => p.id === socket.id);
//       if (idx !== -1) {
//         room.players.splice(idx, 1);
//         if (room.players.length === 0) {
//           clearInterval(room.timer);
//           rooms.delete(roomId);
//         } else {
//           if (!room.players.some((p) => p.isHost)) room.players[0].isHost = true;
//           broadcastRoomUpdate(roomId);
//         }
//       }
//     });
//   });
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));