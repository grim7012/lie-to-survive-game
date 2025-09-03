import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, XCircle, Crown } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isHost: boolean;
  wasLiar?: boolean;
  votedCorrectly?: boolean;
  pointsGained?: number;
}

interface ScoreRevealScreenProps {
  players: Player[];
  liarId: string;
  secretWord: string;
  onContinue: () => void;
  isGameEnd: boolean;
}

export function ScoreRevealScreen({ 
  players, 
  liarId, 
  secretWord, 
  onContinue,
  isGameEnd 
}: ScoreRevealScreenProps) {
  const liar = players.find(p => p.id === liarId);
  const winner = isGameEnd ? players.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  ) : null;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            {isGameEnd ? '🏆 Game Over!' : '🎭 Round Results'}
          </h1>
          
          {liar && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6 mx-auto max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                The Liar Was...
              </h2>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div 
                  className="size-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: liar.avatarColor }}
                >
                  {liar.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-2xl font-bold text-gray-800">{liar.name}</span>
              </div>
              <p className="text-gray-600">
                The secret word was: <span className="font-bold text-green-600">"{secretWord}"</span>
              </p>
            </div>
          )}

          {isGameEnd && winner && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-6 mx-auto max-w-md">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Crown className="size-8 text-yellow-600" />
                <h2 className="text-2xl font-bold text-yellow-900">Winner!</h2>
                <Crown className="size-8 text-yellow-600" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <div 
                  className="size-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: winner.avatarColor }}
                >
                  {winner.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-2xl font-bold text-yellow-900">{winner.name}</span>
              </div>
              <p className="text-yellow-800 mt-2">
                {winner.score} points
              </p>
            </div>
          )}
        </div>

        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {isGameEnd ? 'Final Leaderboard' : 'Score Update'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-500 w-8">
                      #{index + 1}
                    </div>
                    <div 
                      className="size-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: player.avatarColor }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {player.name}
                        </span>
                        {player.id === liarId && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            🎭 Liar
                          </span>
                        )}
                        {isGameEnd && index === 0 && (
                          <Crown className="size-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {player.votedCorrectly !== undefined && (
                          <>
                            {player.votedCorrectly ? (
                              <CheckCircle className="size-4 text-green-500" />
                            ) : (
                              <XCircle className="size-4 text-red-500" />
                            )}
                            <span>
                              {player.votedCorrectly ? 'Correct vote' : 'Wrong vote'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {player.score}
                    </div>
                    {player.pointsGained !== undefined && player.pointsGained !== 0 && (
                      <div className={`text-sm font-medium ${
                        player.pointsGained > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {player.pointsGained > 0 ? '+' : ''}{player.pointsGained}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={onContinue}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg rounded-xl"
          >
            {isGameEnd ? '🎮 Play Again' : '▶️ Next Round'}
          </Button>
        </div>
      </div>
    </div>
  );
}