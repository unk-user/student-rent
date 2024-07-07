const User = require('../models/User.model');

const onlineUsers = new Map();

const userService = {
  setUserOnline: (userId, socketId) => {
    onlineUsers.set(userId, socketId);
  },

  setUserOffline: (userId) => {
    onlineUsers.delete(userId);
  },

  getSocketId: (userId) => {
    return onlineUsers.get(userId);
  },

  getContactStatus: async (userId) => {},
};

module.exports = userService;
