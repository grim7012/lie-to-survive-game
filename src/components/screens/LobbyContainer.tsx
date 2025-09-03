import React, { useState, useEffect } from 'react';
import { LobbyScreen } from './LobbyScreen';
import SocketService from '../../utils/socket';
import type { Player, ChatMessage } from '../../utils/types';

interface LobbyContainerProps {
  roomId: string;
  playerName: string;
  playerColor: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const LobbyContainer: React.FC<LobbyContainerProps> = ({
  roomId,
  playerName,
  playerColor,
  onStartGame,
  onLeaveRoom
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketService = SocketService.getInstance();
    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    // Game started listener
    const handleGameStarted = (data: any) => {
      console.log("🎮 Game started event received:", data);
      onStartGame();
    };

    // Connection status listeners
    const handleConnect = () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      
      // Join room after connection is established
      console.log('🚀 Emitting join-room event for room:', roomId);
      socketInstance.emit('join-room', { 
        roomId, 
        name: playerName, 
        color: playerColor 
      }, (response: any) => {
        console.log('📩 join-room response:', response);
        if (!response?.ok) {
          console.error('❌ Failed to join room:', response?.error);
        }
      });
    };
    
    const handleDisconnect = () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    };

    // Room update listener
    const handleRoomUpdate = (data: any) => {
      console.log('🔄 Room update received:', data);
      if (data && data.players) {
        const mappedPlayers = data.players.map((p: any) => ({
          id: p.socketId || p.id,
          name: p.name,
          score: p.score || 0,
          avatarColor: p.color || '#3b82f6',
          isHost: p.isHost || false
        }));
        
        console.log('👥 Mapped players with host status:',
          mappedPlayers.map((p: any) => `${p.name} (host: ${p.isHost})`)
        );
        
        setPlayers(mappedPlayers);
      }
    };

    // Chat message listener
    const handleChatMessage = (msg: any) => {
      console.log('💬 Chat message received:', msg);
      setChatMessages(prev => [...prev, {
        ...msg,
        timestamp: new Date(msg.timestamp)
      }]);
    };

    // System message listener
    const handleSystemMessage = (msg: string) => {
      console.log('📢 System message:', msg);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        playerID: 'system',
        playerName: 'System',
        playerColor: '#666666',
        message: msg,
        timestamp: new Date()
      }]);
    };

    // Register all listeners
    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('game-started', handleGameStarted);
    socketInstance.on('room-update', handleRoomUpdate);
    socketInstance.on('chat', handleChatMessage);
    socketInstance.on('system', handleSystemMessage);
    socketInstance.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
    });

    // Debug all events
    socketInstance.onAny((event, ...args) => {
      console.log('📨 Socket event:', event, args);
    });

    // If already connected, join room immediately
    if (socketInstance.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up LobbyContainer socket listeners');
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('game-started', handleGameStarted);
      socketInstance.off('room-update', handleRoomUpdate);
      socketInstance.off('chat', handleChatMessage);
      socketInstance.off('system', handleSystemMessage);
      
      // Leave room when component unmounts
      if (socketInstance && socketInstance.connected) {
        socketInstance.emit('leave-room', { roomId });
      }
    };
  }, [roomId, playerName, playerColor, onStartGame]);

  const handleSendMessage = (message: string) => {
    if (socket && socket.connected) {
      socket.emit('chat', { roomId, message });
    }
  };

  const handleStartGame = () => {
    if (socket && socket.connected) {
      console.log("🕹️ Attempting to start game...");
      socket.emit('start-game', { roomId }, (response: any) => {
        console.log('Start game response:', response);
        if (response.ok) {
          console.log("✅ Game started successfully");
          onStartGame();
        } else {
          console.error('❌ Failed to start game:', response.error);
          alert('Failed to start game: ' + response.error);
        }
      });
    } else {
      console.error("❌ Socket not connected");
      alert("Not connected to server. Please refresh the page.");
    }
  };

  const handleLeaveRoom = () => {
    if (socket && socket.connected) {
      socket.emit('leave-room', { roomId });
    }
    onLeaveRoom();
  };

  // Find current player or create a temporary one
  const currentPlayer = players.find(p => p.id === socket?.id) || {
    id: socket?.id || 'temp',
    name: playerName,
    score: 0,
    avatarColor: playerColor,
    isHost: players.length === 0
  };

  return (
    <>
      {/* Debug overlay */}
      {/* <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
        <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        <div>Socket ID: {socket?.id || 'None'}</div>
        <div>Room: {roomId}</div>
        <div>Players: {players.length}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 bg-blue-500 px-2 py-1 rounded"
        >
          Refresh
        </button>
      </div> */}

      <LobbyScreen
        roomCode={roomId}
        players={players}
        currentPlayer={currentPlayer}
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        onStartGame={handleStartGame}
        onLeaveRoom={handleLeaveRoom}
      />
    </>
  );
};