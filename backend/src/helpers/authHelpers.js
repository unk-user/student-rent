const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  return token;
};

const generateRefreshToken = (userId, role) => {
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
  return refreshToken;
};


const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
};
