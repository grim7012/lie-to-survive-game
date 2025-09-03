import React from 'react';
import { Progress } from './ui/progress';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  label?: string;
}

export function TimerBar({ timeLeft, totalTime, label }: TimerBarProps) {
  const percentage = (timeLeft / totalTime) * 100;
  
  const getColorClass = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-mono text-gray-600">
            {Math.ceil(timeLeft)}s
          </span>
        </div>
      )}
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-gray-200"
        />
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}