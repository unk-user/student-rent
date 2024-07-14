const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const userService = require('../services/userService');
const Conversation = require('../models/Conversation.model');

const handleJoinConversations = async (socket, conversationIds) => {
  if (conversationIds?.length > 0) {
    const conversations = await Conversation.find(
      {
        _id: { $in: conversationIds },
      },
      'participants'
    );

    const participantStatuses = conversations.flatMap((conversation) => {
      return conversation.participants.map((participant) => {
        return participant.toString() !== socket.userId
          ? {
              userId: participant,
              status: userService.getUserStatus(participant.toString()),
            }
          : null;
      });
    });

    socket.emit('conversations_status', participantStatuses);
    conversationIds.forEach((conversationId) => {
      socket.join(conversationId);
    });
  }
};

const handleLeaveConversations = (socket, conversationIds) => {
  if (conversationIds?.length > 0) {
    conversationIds.forEach((conversationId) => {
      socket.leave(conversationId);
    });
  }
};

const handleMessageSend = async (socket, io, messageData) => {
  const newMessage = await messageService.createMessage({
    ...messageData,
    sender: socket.userId,
  });
  await conversationService.updateLastMessage(messageData.conversationId, {
    content: messageData.content,
    sender: socket.userId,
    createdAt: newMessage.createdAt,
  });

  io.to(messageData.conversationId).emit('new_message', {
    conversationId: messageData.conversationId,
    message: newMessage,
  });
};

const handleNewConversationMessage = async (socket, io, messageData) => {
  try {
    let conversationId = messageData.conversationId;

    if (!conversationId) {
      const newConversation = await conversationService.createConversation([
        socket.userId,
        messageData.receiverId,
      ]);
      conversationId = newConversation._id.toString();

      socket.join(conversationId);

      const receiverSocketId = userService.getSocketId(messageData.receiverId);
      if (receiverSocketId) {
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        receiverSocket.join(conversationId);
        socket.emit('status_update', {
          userId: messageData.receiverId,
          status: 'online',
          conversationId,
        });
        receiverSocket.emit('status_update', {
          userId: socket.userId,
          status: 'online',
          conversationId,
        });
      }
    }

    const newMessage = await messageService.createMessage({
      conversationId,
      sender: socket.userId,
      content: messageData.content,
    });

    const newConversation = await conversationService.updateLastMessage(
      conversationId,
      {
        sender: socket.userId,
        content: messageData.content,
        createdAt: newMessage.createdAt,
      }
    );

    io.in(conversationId).emit('new_conversation', {
      conversation: newConversation,
      message: newMessage,
    });
  } catch (error) {
    console.error('Error sending new message:', error);
  }
};

const handleStatusUpdate = async (socket, status, userId) => {
  const conversations = await conversationService.getConversations(userId);
  if (conversations.length > 0) {
    conversations.forEach((conversation) => {
      socket.to(conversation._id.toString()).emit('status_update', {
        status,
        conversationId: conversation._id,
        userId,
      });
    });
  }
};

const handleReadMessage = async (socket, conversationId) => {
  await messageService.markMessageAsRead(conversationId, socket.userId);
  socket.to(conversationId).emit('message_read', conversationId);
  socket.emit('mark_conversation_as_read', conversationId);
};

module.exports = {
  handleJoinConversations,
  handleLeaveConversations,
  handleMessageSend,
  handleNewConversationMessage,
  handleReadMessage,
  handleStatusUpdate,
};
