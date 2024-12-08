import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, AlertCircle, RefreshCcw } from 'lucide-react';
import useChat, { Message } from '../../hooks/useChat';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ChatMessageProps {
  user: User;
  onBack: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ user, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    error,
    isLoading,
    sendMessage,
    retryMessage,
    clearError
  } = useChat(user.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/40';
          }}
        />
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <span className="text-sm text-gray-400">
            {user.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-600/10 border-l-4 border-red-600 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={() => retryMessage(message.id)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-[#2b2b2b] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
            rows={1}
            maxLength={500}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-red-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {500 - newMessage.length} characters remaining
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  onRetry: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  return (
    <div className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sent
            ? 'bg-red-600 text-white'
            : 'bg-[#2b2b2b] text-white'
        }`}
      >
        <p>{message.text}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-75">
            {message.timestamp}
          </span>
          {message.sent && (
            <span className="ml-2">
              {message.status === 'sending' && (
                <div className="w-3 h-3 border-t-2 border-white rounded-full animate-spin" />
              )}
              {message.status === 'error' && (
                <button
                  onClick={onRetry}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" />
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;