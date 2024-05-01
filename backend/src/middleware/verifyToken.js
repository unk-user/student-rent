const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const role = decoded.role;
    req.userId = userId;
    req.role = role;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

module.exports = verifyToken;
