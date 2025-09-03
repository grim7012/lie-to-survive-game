// types.ts
// utils/types.ts
export interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isHost: boolean;
  wasLiar?: boolean;
  votedCorrectly?: boolean;
  pointsGained?: number;
}

export interface Hint {
  id: string;
  playerId: string;
  playerName: string;
  playerColor: string;
  hint: string;
  votes: number;
}

export interface ChatMessage {
  id: string;
  playerID: string;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: Date;
}

export interface GameScreenProps {
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  totalTime: number;
  gamePhase: 'waiting' | 'hint' | 'voting' | 'reveal' | 'game-over';
  secretWord: string;
  isLiar: boolean;
  players: Player[];
  hints: Hint[];
  currentPlayer: Player;
  chatMessages: ChatMessage[];
  onGameStart: () => void;
  onSubmitHint: (hint: string) => void;
  onVote: (playerId: string) => void;
  onSendMessage: (message: string) => void;
  hasSubmittedHint: boolean;
  hasVoted: boolean;
}

// Socket event types
export interface RoundStartData {
  secretWord: string;
  isLiar: boolean;
  round: number;
  totalRounds: number;
}

export interface RoomUpdateData {
  roomId: string;
  players: any[];
  phase: string;
  round: number;
  totalRounds: number;
}