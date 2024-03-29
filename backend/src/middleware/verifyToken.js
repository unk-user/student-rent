const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('invalid token');
    return res.status(403).json({message: 'Invalid token'});
  }
};

module.exports = verifyToken;
