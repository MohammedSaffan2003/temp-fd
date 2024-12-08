import Message from '../models/message.model.js';

export const saveMessage = async ({ senderId, recipientId, text, messageId }) => {
  const message = new Message({
    sender: senderId,
    recipient: recipientId,
    text,
    messageId
  });

  await message.save();
  return {
    id: message._id,
    senderId,
    text,
    timestamp: message.createdAt
  };
};

export const getMessageHistory = async (userId1, userId2) => {
  const messages = await Message.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 }
    ]
  })
  .sort('createdAt')
  .limit(50);

  return messages.map(msg => ({
    id: msg._id,
    text: msg.text,
    senderId: msg.sender,
    timestamp: msg.createdAt,
    status: 'sent'
  }));
};