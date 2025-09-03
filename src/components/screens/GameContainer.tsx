// GameContainer.tsx
import React, { useState, useEffect } from 'react';
import { GameScreen } from './GameScreen';
import SocketService from '../../utils/socket';
import type { Player, Hint, ChatMessage } from '../../utils/types';
import { ScoreRevealScreen } from './ScoreRevealScreen';

interface GameContainerProps {
  roomId: string;
  playerName: string;
  playerColor: string;
  onLeaveGame: () => void;
   onPlayAgain: () => void;
   onRoundResults?: (data: any) => void;
onGameOver?: (data: any) => void; 
}

export const GameContainer: React.FC<GameContainerProps> = ({
  roomId,
  playerName,
  playerColor,
  onLeaveGame,
  onPlayAgain
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [showScoreReveal, setShowScoreReveal] = useState(false);
  const [scoreRevealData, setScoreRevealData] = useState({
    players: [] as Player[],
    liarId: '',
    secretWord: '',
    isGameEnd: false
  });
  const [gameState, setGameState] = useState({
    currentRound: 0,
    totalRounds: 6,
    timeLeft: 0,
    totalTime: 60,
    gamePhase: 'waiting',
    secretWord: '',
    isLiar: false,
    players: [] as Player[],
    hints: [] as Hint[],
    chatMessages: [] as ChatMessage[],
    hasSubmittedHint: false,
    hasVoted: false
  });
 

   useEffect(() => {
    const socketService = SocketService.getInstance();
    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    // Join the room
    socketInstance.emit('join-room', { 
      roomId, 
      name: playerName, 
      color: playerColor 
    }, (response: any) => {
      if (!response.ok) {
        console.error('Failed to join room:', response.error);
      }
    });
    // Socket event listeners
    socketInstance.on('round-start', (data: any) => {
      setShowScoreReveal(false);
      setGameState(prev => ({
        ...prev,
        secretWord: data.secretWord,
        isLiar: data.isLiar,
        currentRound: data.round,
        totalRounds: data.totalRounds,
        gamePhase: 'hint',
        hasSubmittedHint: false,
        hasVoted: false,
        hints: []
      }));
    });


    socketInstance.on('round-results', (data: any) => {
      setScoreRevealData({
        players: data.players,
        liarId: data.liarId,
        secretWord: data.secretWord,
        isGameEnd: data.isGameEnd || false
      });
      setShowScoreReveal(true);
    });

    socketInstance.on('game-over', (data: any) => {
      setScoreRevealData({
        players: data.players,
        liarId: data.liarId || '',
        secretWord: data.secretWord || '',
        isGameEnd: true
      });
      setShowScoreReveal(true);
    });
    // In the useEffect of GameContainer.tsx, update the chat event listener:
// In GameContainer.tsx, update the chat event listener:
// In GameContainer.tsx, update the chat event listener:
socketInstance.on('chat', (message: ChatMessage) => {
  try {
    // Ensure timestamp is properly converted
    const timestamp = message.timestamp instanceof Date 
      ? message.timestamp 
      : new Date(message.timestamp);
    
    if (isNaN(timestamp.getTime())) {
      message.timestamp = new Date();
    } else {
      message.timestamp = timestamp;
    }

    setGameState(prev => {
      // Check if message already exists to prevent duplicates
      const messageExists = prev.chatMessages.some(msg => msg.id === message.id);
      if (messageExists) {
        return prev;
      }
      
      return {
        ...prev,
        chatMessages: [...prev.chatMessages, message]
      };
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    setGameState(prev => {
      const messageExists = prev.chatMessages.some(msg => msg.id === message.id);
      if (messageExists) {
        return prev;
      }
      
      return {
        ...prev,
        chatMessages: [...prev.chatMessages, {
          ...message,
          timestamp: new Date()
        }]
      };
    });
  }
});
socketInstance.on('hints-ready', (hints: Hint[]) => {
      setGameState(prev => ({
        ...prev,
        hints: hints,
        gamePhase: 'voting'
      }));
    });

    socketInstance.on('round-results', (data: any) => {
      setGameState(prev => ({
        ...prev,
        hints: data.hints,
        gamePhase: 'reveal'
      }));
    });

    socketInstance.on('room-update', (data: any) => {
      setGameState(prev => ({
        ...prev,
        players: data.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          score: p.score,
          avatarColor: p.color,
          isHost: p.isHost
        })),
        gamePhase: data.gameState || prev.gamePhase,
        currentRound: data.round,
        totalRounds: data.totalRounds,
        timeLeft: data.timeLeft || prev.timeLeft
      }));
    });

    socketInstance.on('timer-update', (data: any) => {
      setGameState(prev => ({
        ...prev,
        timeLeft: data.timeLeft
      }));
    });

    socketInstance.on('chat', (message: ChatMessage) => {
      setGameState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, message]
      }));
    });

    socketInstance.on('game-started', () => {
      setGameState(prev => ({
        ...prev,
        gamePhase: 'hint'
      }));
    });

    // Cleanup on unmount
     return () => {
      if (socketInstance) {
        socketInstance.emit('leave-room', { roomId });
        socketInstance.disconnect();
      }
    };
  }, [roomId, playerName, playerColor]);

  
   const handleContinue = () => {
    setShowScoreReveal(false);
    if (scoreRevealData.isGameEnd) {
      onPlayAgain(); // Handle game restart
    }
    // For next round, the server will automatically start the next round
  };

  const handlePlayAgain = () => {
    if (socket) {
      socket.emit('start-game', { roomId }, (response: any) => {
        if (!response.ok) {
          console.error('Failed to start new game:', response.error);
        }
      });
    }
    setShowScoreReveal(false);
  };

   if (!socket) {
    return <div>Connecting to game server...</div>;
  }

  if (showScoreReveal) {
    return (
      <ScoreRevealScreen
        players={scoreRevealData.players}
        liarId={scoreRevealData.liarId}
        secretWord={scoreRevealData.secretWord}
        onContinue={scoreRevealData.isGameEnd ? handlePlayAgain : handleContinue}
        isGameEnd={scoreRevealData.isGameEnd}
      />
    );
  }
  

  const handleSubmitHint = (hint: string) => {
    if (socket) {
      socket.emit('submit-hint', { roomId, hint }, (response: any) => {
        if (response.ok) {
          setGameState(prev => ({ ...prev, hasSubmittedHint: true }));
        }
      });
    }
  };

  const handleVote = (playerId: string) => {
    if (socket) {
      socket.emit('submit-vote', { roomId, targetId: playerId }, (response: any) => {
        if (response.ok) {
          setGameState(prev => ({ ...prev, hasVoted: true }));
        }
      });
    }
  };

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.emit('chat', { roomId, message }, (response: any) => {
        if (!response.ok) {
          console.error('Failed to send message:', response.error);
        }
      });
    }
  };

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start-game', { roomId }, (response: any) => {
        if (!response.ok) {
          console.error('Failed to start game:', response.error);
        }
      });
    }
  };

  if (!socket) {
    return <div>Connecting to game server...</div>;
  }

  // Get current player with updated score
const currentPlayer = gameState.players.find(p => p.id === socket.id) || {
    id: socket.id,
    name: playerName,
    score: 0,
    avatarColor: playerColor,
    isHost: false
  };

  return (
    <GameScreen
      currentRound={gameState.currentRound}
      totalRounds={gameState.totalRounds}
      timeLeft={gameState.timeLeft}
      totalTime={gameState.totalTime}
      gamePhase={gameState.gamePhase as any}
      secretWord={gameState.secretWord}
      isLiar={gameState.isLiar}
      players={gameState.players}
      hints={gameState.hints}
      currentPlayer={currentPlayer}
      chatMessages={gameState.chatMessages}
      onSubmitHint={handleSubmitHint}
      onVote={handleVote}
      onSendMessage={handleSendMessage}
      onStartGame={handleStartGame}
      hasSubmittedHint={gameState.hasSubmittedHint}
      hasVoted={gameState.hasVoted}
    />
  );
};