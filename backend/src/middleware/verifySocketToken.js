const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const verifySocketToken = async (accessToken) => {
  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const role = decoded.role;
    const user = await User.findById(userId).select({
      refreshTokens: 0,
      hash: 0,
    });
    if (!user) {
      throw new Error('Unauthorized');
    }
    return { userId, role, user };
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
};

module.exports = verifySocketToken;
