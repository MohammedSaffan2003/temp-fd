import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface LiveChatProps {
  streamId: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ streamId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('joinStreamChat', { streamId });

    socket.on('chatMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.emit('leaveStreamChat', { streamId });
      socket.off('chatMessage');
    };
  }, [socket, user, streamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !user || !newMessage.trim()) return;

    const message = {
      streamId,
      text: newMessage,
      userId: user.id,
      username: user.username,
      timestamp: new Date()
    };

    socket.emit('sendStreamMessage', message);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">Live Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-sm font-medium">
                {message.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-medium">{message.username}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-200">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-red-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;