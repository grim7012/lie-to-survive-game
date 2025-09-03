// ChatBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ChatMessage {
  id: string;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: Date | string;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentPlayerName: string;
}

export function ChatBox({ messages, onSendMessage, currentPlayerName }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (timestamp: Date | string) => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Remove duplicate messages based on ID
  const uniqueMessages = messages.reduce((acc, current) => {
    const existing = acc.find(msg => msg.id === current.id);
    if (!existing) {
      return acc.concat([current]);
    }
    return acc;
  }, [] as ChatMessage[]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">💬 Game Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 min-h-0"> {/* Replace ScrollArea */}
        <div className="space-y-3">
          {uniqueMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="size-2 rounded-full" 
                  style={{ backgroundColor: msg.playerColor }}
                />
                <span className={`text-sm font-medium ${
                  msg.playerName === currentPlayerName 
                    ? 'text-blue-600' 
                    : 'text-gray-700'
                }`}>
                  {msg.playerName}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-gray-900 text-sm bg-gray-50 rounded-lg px-3 py-2 break-words">
                {msg.message}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}