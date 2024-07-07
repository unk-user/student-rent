function userStatusHandler(socket) {
  socket.on('set_status', (status) => {
    socket.broadcast.emit('user_status', {
      userId: socket.userData.userId,
      status,
    });
  });
}

module.exports = userStatusHandler;
