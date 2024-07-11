const Message = require('../models/Message.model');

const createMessage = async (messageData) => {
  return await Message.create(messageData);
};

const markMessageAsRead = async (conversationId, userId) => {
  return await Message.updateMany(
    { conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
};

module.exports = {
  createMessage,
  markMessageAsRead,
};
