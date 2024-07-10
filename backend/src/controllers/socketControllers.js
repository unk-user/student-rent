const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const userService = require('../services/userService');

const handleJoinConversation = (socket, conversationIds) => {
  conversationIds.forEach((conversationId) => {
    socket.join(conversationId);
  });
};

const handleMessageSend = async (socket, messageData) => {
  const newMessage = await messageService.createMessage(messageData);
  await conversationService.updateLastMessage(
    messageData.conversationId,
    messageData
  );

  // Emit message to all participants except the sender
  socket.to(messageData.conversationId).emit('new_message', {
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

    io.in(conversationId).emit('new_conversation', newConversation);
    io.in(conversationId).emit('new_conversation_message', newMessage);
  } catch (error) {
    console.error('Error sending new message:', error);
  }
};

const handleReadMessage = async (socket, data) => {
  await messageService.markMessageAsRead(data.conversationId, data.userId);
  socket.to(data.conversationId).emit('message_read', data);
};

module.exports = {
  handleJoinConversation,
  handleMessageSend,
  handleNewConversationMessage,
  handleReadMessage,
};
