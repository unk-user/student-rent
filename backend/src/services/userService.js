const User = require('../models/User.model');
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

const getUserStatus = (userId) => {
  return onlineUsers.get(userId.toString()) ? 'online' : 'offline';
};

const getUserData = async (userId) => {
  return await User.findById(userId).select({ hash: 0, refreshTokens: 0 });
};

module.exports = {
  setUserOnline,
  setUserOffline,
  getSocketId,
  getUserStatus,
  getUserData,
};
