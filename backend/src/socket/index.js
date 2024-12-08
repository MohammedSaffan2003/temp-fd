import jwt from 'jsonwebtoken';
import { saveMessage, getMessageHistory } from '../services/chat.service.js';

export const setupSocketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on('chat:join', async ({ recipientId }) => {
      const room = [socket.userId, recipientId].sort().join('-');
      socket.join(room);

      try {
        const history = await getMessageHistory(socket.userId, recipientId);
        socket.emit('chat:history', history);
      } catch (err) {
        socket.emit('chat:error', { message: 'Failed to load chat history' });
      }
    });

    socket.on('chat:message', async ({ recipientId, text, messageId }, callback) => {
      const room = [socket.userId, recipientId].sort().join('-');
      
      try {
        const message = await saveMessage({
          senderId: socket.userId,
          recipientId,
          text,
          messageId
        });

        io.to(room).emit('chat:message', message);
        callback({ success: true });
      } catch (err) {
        callback({ success: false, error: err.message });
      }
    });

    socket.on('chat:leave', ({ recipientId }) => {
      const room = [socket.userId, recipientId].sort().join('-');
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};