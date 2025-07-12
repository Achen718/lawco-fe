import React from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '@/types/chat';

interface ChatPaneProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

export const ChatPane: React.FC<ChatPaneProps> = ({
  messages,
  isLoading = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col h-full overflow-y-auto p-4 space-y-4 ${className}`}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};
