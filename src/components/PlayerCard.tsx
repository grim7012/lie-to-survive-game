// import React from 'react';
// import { Avatar, AvatarFallback } from './ui/avatar';

// interface PlayerCardProps {
//   id: string;
//   name: string;
//   score: number;
//   avatarColor: string;
//   isTyping?: boolean;
//   isHost?: boolean;
//   isCurrentPlayer?: boolean;
// }

// export function PlayerCard({ 
//   name, 
//   score, 
//   avatarColor, 
//   isTyping = false, 
//   isHost = false, 
//   isCurrentPlayer = false 
// }: PlayerCardProps) {
//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-xl shadow-sm border ${
//       isCurrentPlayer 
//         ? 'border-blue-400 bg-blue-50' 
//         : 'border-gray-100 bg-white'
//     }`}>
//       <div className="relative">
//         <Avatar className="size-10" style={{ backgroundColor: avatarColor }}>
//           <AvatarFallback className="text-white font-medium" style={{ backgroundColor: avatarColor }}>
//             {name.charAt(0).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>
//         {isTyping && (
//           <div className="absolute -bottom-1 -right-1 size-3 bg-green-400 rounded-full flex items-center justify-center">
//             <div className="size-1.5 bg-white rounded-full animate-pulse" />
//           </div>
//         )}
//         {isCurrentPlayer && (
//           <div className="absolute -bottom-1 -right-1 size-3 bg-blue-500 rounded-full flex items-center justify-center">
//             <div className="size-1.5 bg-white rounded-full" />
//           </div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <p className="font-medium text-gray-900 truncate">{name}</p>
//           {isHost && (
//             <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
//               👑 Host
//             </span>
//           )}
//           {isCurrentPlayer && (
//             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//               You
//             </span>
//           )}
//         </div>
//         <p className="text-sm text-gray-600">{score} points</p>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface PlayerCardProps {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isTyping?: boolean;
  isHost?: boolean;
  isCurrentPlayer?: boolean;
}

export function PlayerCard({ 
  name, 
  score, 
  avatarColor, 
  isTyping = false, 
  isHost = false, 
  isCurrentPlayer = false 
}: PlayerCardProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl shadow-sm border ${
      isCurrentPlayer 
        ? 'border-blue-400 bg-blue-50' 
        : 'border-gray-100 bg-white'
    }`}>
      <div className="relative">
        <Avatar className="size-10" style={{ backgroundColor: avatarColor }}>
          <AvatarFallback className="text-white font-medium" style={{ backgroundColor: avatarColor }}>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {/* Current player indicator at top-right */}
        {isCurrentPlayer && (
          <div className="absolute -top-1 -right-1 size-3 bg-blue-500 rounded-full flex items-center justify-center z-10 border-2 border-white">
            <div className="size-1.5 bg-white rounded-full" />
          </div>
        )}
        
        {/* Typing indicator at bottom-right */}
        {isTyping && (
          <div className="absolute -bottom-1 -right-1 size-3 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
            <div className="size-1.5 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{name}</p>
          {isHost && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full shrink-0">
              👑 Host
            </span>
          )}
          {isCurrentPlayer && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full shrink-0">
              You
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{score} points</p>
      </div>
    </div>
  );
} 