const onlineUsers = new Map();

const setUserOnline = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const setUserOffline = (userId) => {
  onlineUsers.delete(userId);
};

const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};

const getOnlineUsers = () => {
  return onlineUsers;
};

module.exports = {
  setUserOnline,
  setUserOffline,
  getSocketId,
  getOnlineUsers,
};
