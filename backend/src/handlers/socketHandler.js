const socketControllers = require('../controllers/socketControllers');
const userService = require('../services/userService');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    userService.setUserOnline(socket.userId, socket.id);
    console.log(userService.getOnlineUsers());

    socket.on('ping', () => {
      socket.emit('pong');
      console.log('ping-pong')
    });

    socket.on('join_conversation', (conversationIds) => {
      socketControllers.handleJoinConversation(socket, conversationIds);
    });

    socket.on('send_message', (messageData) => {
      socketControllers.handleMessageSend(socket, messageData);
    });

    socket.on('send_message_new', (messageData) => {
      socketControllers.handleNewConversationMessage(socket, io, messageData);
    });

    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('typing', data);
    });

    socket.on('read_message', async (data) => {
      await socketControllers.handleReadMessage(socket, data);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      userService.setUserOffline(socket.userId);
    });
  });
}

module.exports = socketHandler;
