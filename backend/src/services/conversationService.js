const Conversation = require('../models/Conversation.model');

const updateLastMessage = async (conversationId, messageData) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: {
        sender: messageData.sender,
        content: messageData.content,
        createdAt: messageData.createdAt,
      },
      updatedAt: messageData.createdAt,
    },
    { new: true }
  ).populate('participants');
};

const createConversation = async (participants) => {
  return await Conversation.create({ participants });
};

const getConversationParticipants = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId);
  return conversation.participants;
};

module.exports = {
  updateLastMessage,
  getConversationParticipants,
  createConversation,
};
