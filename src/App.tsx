// import React, { useState } from "react";
// import { LandingPage } from "./components/screens/LandingPage";
// import { LobbyContainer } from "./components/screens/LobbyContainer";
// import  {GameContainer } from "./components/screens/GameContainer";
// import { ScoreRevealScreen } from "./components/screens/ScoreRevealScreen";
// import { Toaster } from "./components/ui/sonner";

// type GameState = "landing" | "lobby" | "game" | "reveal";

// interface Player {
//   id: string;
//   name: string;
//   score: number;
//   avatarColor: string;
//   isHost: boolean;
//   isTyping?: boolean;
// }

// const AVATAR_COLORS = [
//   "#6366f1",
//   "#8b5cf6",
//   "#ec4899",
//   "#f59e0b",
//   "#10b981",
//   "#06b6d4",
//   "#ef4444",
//   "#84cc16",
// ];

// function generateRoomCode(): string {
//   return Math.random().toString(36).substr(2, 6).toUpperCase();
// }

// function generateId(): string {
//   return Math.random().toString(36).substr(2, 9);
// }

// export default function App() {
//   const [gameState, setGameState] = useState<GameState>("landing");
//   const [roomCode, setRoomCode] = useState("");
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
//   const [liarId, setLiarId] = useState("");
//   const [secretWord, setSecretWord] = useState("");
//   const [currentRound, setCurrentRound] = useState(1);
//   const [totalRounds] = useState(6);

  

//   const createRoom = (nickname: string) => {
//     const newRoomCode = generateRoomCode();
//     const playerId = generateId();
//     const player: Player = {
//       id: playerId,
//       name: nickname,
//       score: 0,
//       avatarColor: AVATAR_COLORS[0],
//       isHost: true,
//     };

//     setRoomCode(newRoomCode);
//     setPlayers([player]);
//     setCurrentPlayer(player);
//     setGameState("lobby");
//   };

//   const joinRoom = (nickname: string, code: string) => {
//     const playerId = generateId();
//     const player: Player = {
//       id: playerId,
//       name: nickname,
//       score: 0,
//       avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
//       isHost: false,
//     };

//     setRoomCode(code);
//     setPlayers((prev) => [...prev, player]);
//     setCurrentPlayer(player);
//     setGameState("lobby");
//   };

//   const leaveRoom = () => {
//     setGameState("landing");
//     setPlayers([]);
//     setCurrentPlayer(null);
//     setRoomCode("");
//     setCurrentRound(1);
//     setSecretWord("");
//     setLiarId("");
//   };

//   const continueGame = () => {
//     if (currentRound >= totalRounds) {
//       // Game ended
//       setGameState("lobby");
//       setCurrentRound(1);
//       setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
//     } else {
//       // Next round
//       setCurrentRound((prev) => prev + 1);
//       setGameState("game");
//     }
//   };

//   if (!currentPlayer && gameState !== "landing") {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <Toaster />

//       {gameState === "landing" && (
//         <LandingPage onCreateRoom={createRoom} onJoinRoom={joinRoom} />
//       )}

//       {gameState === "lobby" && currentPlayer && (
//         <LobbyContainer
//           roomId={roomCode}
//           playerName={currentPlayer.name}
//           playerColor={currentPlayer.avatarColor}
//           onStartGame={() => setGameState("game")}
//           onLeaveRoom={leaveRoom}
//         />
//       )}

//       {gameState === "game" && currentPlayer && (
//         <GameContainer
//           roomId={roomCode}
//           playerName={currentPlayer.name}
//           playerColor={currentPlayer.avatarColor}
//           onPlayAgain={handlePlayAgain}
 
//     />
        
//       )}

//       {gameState === "reveal" && (
//         <ScoreRevealScreen
//           players={players}
//           liarId={liarId}
//           secretWord={secretWord}
//           onContinue={continueGame}
//           isGameEnd={currentRound >= totalRounds}
//         />
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import { LandingPage } from "./components/screens/LandingPage";
import { LobbyContainer } from "./components/screens/LobbyContainer";
import { GameContainer } from "./components/screens/GameContainer";
import { ScoreRevealScreen } from "./components/screens/ScoreRevealScreen";
import { Toaster } from "./components/ui/sonner";

type GameState = "landing" | "lobby" | "game" | "reveal";

interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isHost: boolean;
  isTyping?: boolean;
  wasLiar?: boolean;
  votedCorrectly?: boolean;
  pointsGained?: number;
}

const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#84cc16",
];

function generateRoomCode(): string {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [liarId, setLiarId] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(6);
  const [scoreRevealData, setScoreRevealData] = useState({
    players: [] as Player[],
    liarId: '',
    secretWord: '',
    isGameEnd: false
  });

  const createRoom = (nickname: string) => {
    const newRoomCode = generateRoomCode();
    const playerId = generateId();
    const player: Player = {
      id: playerId,
      name: nickname,
      score: 0,
      avatarColor: AVATAR_COLORS[0],
      isHost: true,
    };

    setRoomCode(newRoomCode);
    setPlayers([player]);
    setCurrentPlayer(player);
    setGameState("lobby");
  };

  const joinRoom = (nickname: string, code: string) => {
    const playerId = generateId();
    const player: Player = {
      id: playerId,
      name: nickname,
      score: 0,
      avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
      isHost: false,
    };

    setRoomCode(code);
    setPlayers((prev) => [...prev, player]);
    setCurrentPlayer(player);
    setGameState("lobby");
  };

  const leaveRoom = () => {
    setGameState("landing");
    setPlayers([]);
    setCurrentPlayer(null);
    setRoomCode("");
    setCurrentRound(1);
    setSecretWord("");
    setLiarId("");
    setScoreRevealData({
      players: [],
      liarId: '',
      secretWord: '',
      isGameEnd: false
    });
  };

  const handleRoundResults = (data: {
    players: Player[];
    liarId: string;
    secretWord: string;
    isGameEnd?: boolean;
  }) => {
    setScoreRevealData({
      players: data.players,
      liarId: data.liarId,
      secretWord: data.secretWord,
      isGameEnd: data.isGameEnd || false
    });
    setGameState("reveal");
  };

  const handleGameOver = (data: {
    players: Player[];
    liarId?: string;
    secretWord?: string;
    isGameEnd: boolean;
  }) => {
    setScoreRevealData({
      players: data.players,
      liarId: data.liarId || '',
      secretWord: data.secretWord || '',
      isGameEnd: true
    });
    setGameState("reveal");
  };

  const continueGame = () => {
    if (scoreRevealData.isGameEnd) {
      // Game ended - reset to lobby
      setGameState("lobby");
      setCurrentRound(1);
      // Reset scores but keep players
      setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    } else {
      // Next round - continue playing
      setCurrentRound(prev => prev + 1);
      setGameState("game");
    }
  };

  const handlePlayAgain = () => {
    // Reset game state for a new game
    setGameState("lobby");
    setCurrentRound(1);
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
  };

  if (!currentPlayer && gameState !== "landing") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Toaster />

      {gameState === "landing" && (
        <LandingPage onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      )}

      {gameState === "lobby" && currentPlayer && (
        <LobbyContainer
          roomId={roomCode}
          playerName={currentPlayer.name}
          playerColor={currentPlayer.avatarColor}
          onStartGame={() => setGameState("game")}
          onLeaveRoom={leaveRoom}
        />
      )}

      {gameState === "game" && currentPlayer && (
        <GameContainer
          roomId={roomCode}
          playerName={currentPlayer.name}
          playerColor={currentPlayer.avatarColor}
          onLeaveGame={leaveRoom}
          onPlayAgain={handlePlayAgain}
          onRoundResults={handleRoundResults}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === "reveal" && (
        <ScoreRevealScreen
          players={scoreRevealData.players}
          liarId={scoreRevealData.liarId}
          secretWord={scoreRevealData.secretWord}
          onContinue={continueGame}
          isGameEnd={scoreRevealData.isGameEnd}
        />
      )}
    </div>
  );
}