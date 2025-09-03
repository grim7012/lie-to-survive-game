import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PlayerCard } from '../PlayerCard';
import { ChatBox } from '../ChatBox';
import { Copy, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: Date;
}

interface LobbyScreenProps {
  roomCode: string;
  players: Player[];
  currentPlayer: Player;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export function LobbyScreen({ 
  roomCode, 
  players, 
  currentPlayer,
  chatMessages,
  onSendMessage,
  onStartGame,
  onLeaveRoom
}: LobbyScreenProps) {
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success('Room code copied to clipboard!');
  };

  const canStartGame = players.length >= 3 && currentPlayer.isHost;

  return (
    <div className=" min-h-screen bg-gradient-to-br from-teal-400 via-blue-300 to-purple-400 p-4 fixed inset-0 overflow-y-auto">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              🎭 Lie to Survive
            </h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-white font-medium">Room:</span>
              <span className="font-mono text-xl text-white">{roomCode}</span>
              <Button
                onClick={copyRoomCode}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-1"
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={onLeaveRoom}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Leave Room
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Players Panel */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Players ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  score={player.score}
                  avatarColor={player.avatarColor}
                  isHost={player.isHost}
                />
              ))}
              
              {players.length < 8 && (
                <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm">Waiting for more players...</p>
                  <p className="text-xs mt-1">{8 - players.length} spots left</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiting Area */}
          <Card className="bg-white/95 backdrop-blur-sm flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Getting Ready...</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4 animate-bounce">🎲</div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                Waiting for players
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Need at least 3 players to start the game.
                {players.length < 3 && ` ${3 - players.length} more needed.`}
              </p>
              
              {canStartGame && (
  <Button
    onClick={onStartGame}
    className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 rounded-xl"
  >
    🚀 Start Game
  </Button>
)}

{!currentPlayer.isHost && players.length >= 3 && (
  <p className="text-gray-500 text-sm">
    Waiting for host to start the game...
  </p>
)}
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <div className="h-full">
            <ChatBox
              messages={chatMessages}
              onSendMessage={onSendMessage}
              currentPlayerName={currentPlayer.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}