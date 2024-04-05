const jwt = require('jsonwebtoken');
const User = require('../models/User.model')

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.sendStatus(401)
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    req.userId = userId;
    req.role = decoded.role;
    const user = await User.findOne({ _id: userId });
    if(!user) return res.sendStatus(403);
    next();
  } catch (error) {
    console.error('invalid token');
    return res.status(403).json({message: 'Invalid token'});
  }
};

module.exports = verifyToken;
