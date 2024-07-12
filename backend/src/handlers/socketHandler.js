const socketControllers = require('../controllers/socketControllers');
const userService = require('../services/userService');

function socketHandler(io) {
  io.on('connection', (socket) => {
    userService.setUserOnline(socket.userId, socket.id);

    socket.on('ping', () => {
      socket.emit('pong');
      console.log('ping-pong');
    });

    socket.on('join_conversations', (conversationIds) => {
      socketControllers.handleJoinConversations(socket, conversationIds);
    });

    socket.on('leave_conversations', (conversationIds) => {
      socketControllers.handleLeaveConversations(socket, conversationIds);
    });

    socket.on('send_message', (messageData) => {
      socketControllers.handleMessageSend(socket, io, messageData);
    });

    socket.on('send_message_new', (messageData) => {
      socketControllers.handleNewConversationMessage(socket, io, messageData);
    });

    socket.on('send_status', ({ status, userId }) => {
      socketControllers.handleStatusUpdate(socket, status, userId);
    });

    socket.on('read_message', async (conversationId) => {
      await socketControllers.handleReadMessage(socket, conversationId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      socket.broadcast.emit('status_update', {
        status: 'offline',
        userId: socket.userId,
      });
      userService.setUserOffline(socket.userId);
    });
  });
}

module.exports = socketHandler;
