import React from 'react';
import { Button } from './ui/button';

interface HintCardProps {
  id: string;
  hint: string;
  playerName: string;
  playerColor: string;
  onVote?: (playerId: string) => void;
  isVotingPhase?: boolean;
  hasVoted?: boolean;
  voteCount?: number;
  isCurrentPlayer?: boolean;
}

export function HintCard({ 
  id, 
  hint, 
  playerName, 
  playerColor, 
  onVote, 
  isVotingPhase = false,
  hasVoted = false,
  voteCount = 0,
  isCurrentPlayer = false
}: HintCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-md border-2 transition-all ${
      isCurrentPlayer 
        ? 'border-blue-400 bg-blue-50' 
        : 'border-gray-100 hover:border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="size-3 rounded-full" 
          style={{ backgroundColor: playerColor }}
        />
        <span className="text-sm font-medium text-gray-700">{playerName}</span>
        {isCurrentPlayer && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            You
          </span>
        )}
        {voteCount > 0 && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-auto">
            {voteCount} vote{voteCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <p className="text-gray-900 mb-4 min-h-[2.5rem] flex items-center">
        "{hint}"
      </p>
      
      {isVotingPhase && onVote && (
        <Button
          onClick={() => onVote(id)}
          disabled={hasVoted}
          className={`w-full ${
            hasVoted 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {hasVoted ? '✅ Voted' : '🗳️ Vote for Liar'}
        </Button>
      )}
    </div>
  );
}