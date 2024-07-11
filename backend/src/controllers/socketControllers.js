const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const userService = require('../services/userService');

const handleJoinConversations = (socket, conversationIds) => {
  if (conversationIds?.length > 0) {
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
  console.log(messageData);
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
        console.log('receiver online: ', receiverSocketId);
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        receiverSocket.join(conversationId);
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

const handleStatusUpdate = (socket, status, conversationIds) => {
  if (conversationIds?.length > 0) {
    console.log('status update for user:', socket.userId, status);
    conversationIds.forEach((conversationId) => {
      socket.to(conversationId).emit('status_update', {
        status,
        conversationId,
        userId: socket.userId,
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
