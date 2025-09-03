// GameScreen.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PlayerCard } from '../PlayerCard';
import { HintCard } from '../HintCard';
import { ChatBox } from '../ChatBox';
import { TimerBar } from '../TimerBar';
import { Eye, EyeOff, Users, Play } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isHost: boolean;
  isTyping?: boolean;
}

interface Hint {
  id: string;
  playerId: string;
  playerName: string;
  playerColor: string;
  hint: string;
  votes: number;
}

interface ChatMessage {
  id: string;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: Date;
}

interface GameScreenProps {
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  totalTime: number;
  gamePhase: 'waiting' | 'hint' | 'voting' | 'reveal';
  secretWord?: string;
  isLiar: boolean;
  players: Player[];
  hints: Hint[];
  currentPlayer: Player;
  chatMessages: ChatMessage[];
  onSubmitHint: (hint: string) => void;
  onVote: (playerId: string) => void;
  onSendMessage: (message: string) => void;
  onStartGame: () => void;
  hasSubmittedHint: boolean;
  hasVoted: boolean;
}

export function GameScreen({
  currentRound,
  totalRounds,
  timeLeft,
  totalTime,
  gamePhase,
  secretWord,
  isLiar,
  players,
  hints,
  currentPlayer,
  chatMessages,
  onSubmitHint,
  onVote,
  onSendMessage,
  onStartGame,
  hasSubmittedHint,
  hasVoted
}: GameScreenProps) {
  const [currentHint, setCurrentHint] = useState('');
  const [showWord, setShowWord] = useState(true);

  const handleSubmitHint = () => {
    if (currentHint.trim()) {
      onSubmitHint(currentHint.trim());
      setCurrentHint('');
    }
  };

  const getPhaseTitle = () => {
    switch (gamePhase) {
      case 'waiting':
        return '👋 Waiting for players';
      case 'hint':
        return '💡 Submit your hint';
      case 'voting':
        return '🗳️ Vote for the liar';
      case 'reveal':
        return '🎭 Results';
      default:
        return '';
    }
  };

  const getPhaseDescription = () => {
    switch (gamePhase) {
      case 'waiting':
        return currentPlayer.isHost 
          ? 'Start the game when everyone has joined'
          : 'Waiting for the host to start the game';
      case 'hint':
        return isLiar 
          ? "You don't know the word! Give a vague hint that could fit many words."
          : `Give a hint for "${secretWord}" without saying the word!`;
      case 'voting':
        return 'Look at all hints and vote for who you think is the liar!';
      case 'reveal':
        return 'See who fooled who!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Round {currentRound} / {totalRounds}
              </h1>
              <div className="flex items-center gap-3">
                {!isLiar && secretWord && gamePhase !== 'waiting' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Secret word:</span>
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                      {showWord ? (
                        <span className="font-bold text-green-800">{secretWord}</span>
                      ) : (
                        <span className="font-mono text-green-800">••••••••</span>
                      )}
                      <Button
                        onClick={() => setShowWord(!showWord)}
                        size="sm"
                        variant="ghost"
                        className="p-0 h-auto text-green-600 hover:bg-green-200"
                      >
                        {showWord ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </Button>
                    </div>
                  </div>
                )}
                
                {isLiar && gamePhase !== 'waiting' && (
                  <div className="bg-red-100 px-3 py-1 rounded-lg">
                    <span className="text-red-800 font-medium">🎭 You are the LIAR!</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {gamePhase !== 'waiting' && (
                <div className="w-64">
                  <TimerBar 
                    timeLeft={timeLeft} 
                    totalTime={totalTime}
                    label={getPhaseTitle()}
                  />
                </div>
              )}
              
              {gamePhase === 'waiting' && currentPlayer.isHost && (
                <Button onClick={onStartGame} className="bg-green-500 hover:bg-green-600">
                  <Play className="mr-2 size-4" />
                  Start Game
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Players Sidebar */}
          <Card className="bg-white/95 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
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
    isTyping={player.isTyping}
    isHost={player.isHost}
    isCurrentPlayer={player.id === currentPlayer.id} // This is the fix
  />
              ))}
            </CardContent>
          </Card>

          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{getPhaseTitle()}</CardTitle>
                <p className="text-gray-600">{getPhaseDescription()}</p>
              </CardHeader>
              
              <CardContent>
                {gamePhase === 'waiting' && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-lg font-medium text-gray-800 mb-2">
                      Welcome to the game!
                    </p>
                    <p className="text-gray-600">
                      {players.length} player{players.length !== 1 ? 's' : ''} joined
                    </p>
                    {currentPlayer.isHost && players.length < 3 && (
                      <p className="text-orange-600 mt-2">
                        Need at least 3 players to start
                      </p>
                    )}
                  </div>
                )}

                {gamePhase === 'hint' && (
                  <div className="space-y-4">
                    {!hasSubmittedHint ? (
                      <div className="space-y-3">
                        <Input
                          value={currentHint}
                          onChange={(e) => setCurrentHint(e.target.value)}
                          placeholder="Type your hint here..."
                          className="text-lg py-3 rounded-lg"
                          maxLength={100}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentHint.trim()) {
                              handleSubmitHint();
                            }
                          }}
                        />
                        <Button
                          onClick={handleSubmitHint}
                          disabled={!currentHint.trim()}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
                        >
                          Submit Hint
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="text-lg font-medium text-gray-800 mb-2">
                          Hint submitted!
                        </p>
                        <p className="text-gray-600">
                          Waiting for other players...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {gamePhase === 'voting' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hints.map((hint) => (
                      <HintCard
                        key={hint.id}
                        id={hint.playerId}
                        hint={hint.hint}
                        playerName={hint.playerName}
                        playerColor={hint.playerColor}
                        onVote={onVote}
                        isVotingPhase={true}
                        hasVoted={hasVoted}
                        voteCount={hint.votes}
                        isCurrentPlayer={hint.playerId === currentPlayer.id}
                      />
                    ))}
                  </div>
                )}

                {gamePhase === 'reveal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hints.map((hint) => (
                        <HintCard
                          key={hint.id}
                          id={hint.playerId}
                          hint={hint.hint}
                          playerName={hint.playerName}
                          playerColor={hint.playerColor}
                          voteCount={hint.votes}
                          isCurrentPlayer={hint.playerId === currentPlayer.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="h-[70vh]">
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