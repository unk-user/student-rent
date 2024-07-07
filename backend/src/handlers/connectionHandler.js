const userService = require('../services/userService');

function connectionHandler(socket) {
  console.log('User connected: ', socket.userId);

  userService.setUserOnline(socket.userId, socket.id);

  socket.broadcast.emit('user_status', {
    userId: socket.userId,
    status: 'online',
  });

  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation-${conversationId}`);
  })

  socket.on('disconnect', (reason, details) => {
    console.log(reason);
    console.log(details);
  });
}

module.exports = connectionHandler;
