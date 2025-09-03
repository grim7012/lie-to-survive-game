import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface LandingPageProps {
  onCreateRoom: (nickname: string) => void;
  onJoinRoom: (nickname: string, roomCode: string) => void;
}

export function LandingPage({ onCreateRoom, onJoinRoom }: LandingPageProps) {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = () => {
    if (nickname.trim()) {
      onCreateRoom(nickname.trim());
    }
  };

  const handleJoinRoom = () => {
    if (nickname.trim() && roomCode.trim()) {
      onJoinRoom(nickname.trim(), roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🎭 Lie to Survive
          </h1>
          <p className="text-white/90 text-lg">
            The ultimate bluffing party game!
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-800">
              {isJoining ? 'Join a Room' : 'Create a Room'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nickname" className="text-gray-700">
                Your Nickname
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname..."
                className="mt-1 rounded-lg border-gray-300"
                maxLength={20}
              />
            </div>

            {isJoining && (
              <div>
                <Label htmlFor="roomCode" className="text-gray-700">
                  Room Code
                </Label>
                <Input
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code..."
                  className="mt-1 rounded-lg border-gray-300 font-mono"
                  maxLength={6}
                />
              </div>
            )}

            <div className="space-y-3 pt-2">
              {!isJoining ? (
                <>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!nickname.trim()}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-medium"
                  >
                    🟢 Create Room
                  </Button>
                  <Button
                    onClick={() => setIsJoining(true)}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 py-3 rounded-lg text-lg font-medium"
                  >
                    🔵 Join Room
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleJoinRoom}
                    disabled={!nickname.trim() || !roomCode.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                  >
                    🔵 Join Room
                  </Button>
                  <Button
                    onClick={() => {
                      setIsJoining(false);
                      setRoomCode('');
                    }}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-lg text-lg font-medium"
                  >
                    ← Back
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            A party game for 3-8 players
          </p>
          <button className="text-white/70 text-sm underline mt-2 hover:text-white">
            How to play?
          </button>
        </div>
      </div>
    </div>
  );
}