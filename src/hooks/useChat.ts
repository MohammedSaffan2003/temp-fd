import { useState, useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useAuthStore } from '../store/authStore';

export interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
}

export const useChat = (recipientId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !user) return;

    setIsLoading(true);
    socket.emit('chat:join', { recipientId });

    socket.on('chat:history', (history) => {
      setMessages(history);
      setIsLoading(false);
    });

    socket.on('chat:message', (message) => {
      setMessages((prev) => [...prev, {
        ...message,
        sent: message.senderId === user.id,
        status: 'sent',
      }]);
    });

    socket.on('chat:error', (err) => {
      setError(err.message);
    });

    return () => {
      socket.off('chat:history');
      socket.off('chat:message');
      socket.off('chat:error');
      socket.emit('chat:leave', { recipientId });
    };
  }, [socket, recipientId, user]);

  const sendMessage = useCallback(async (text: string) => {
    if (!socket || !text.trim()) return;

    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      text,
      sent: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      await new Promise((resolve, reject) => {
        socket.emit('chat:message', {
          recipientId,
          text,
          messageId,
        }, (ack: { success: boolean; error?: string }) => {
          if (ack.success) resolve(ack);
          else reject(new Error(ack.error));
        });
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'sent' } : msg
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'error' } : msg
        )
      );
    }
  }, [socket, recipientId]);

  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: 'sending' } : msg
      )
    );

    try {
      await sendMessage(message.text);
    } catch (err) {
      // Error handling is done in sendMessage
    }
  }, [messages, sendMessage]);

  return {
    messages,
    error,
    isLoading,
    sendMessage,
    retryMessage,
    clearError: () => setError(null),
  };
};

export default useChat;