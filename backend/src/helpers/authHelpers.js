const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s',
  });
  return token;
};

const generateRefreshToken = (userId, role) => {
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  return refreshToken;
};

const rotateRefreshToken = async (user, refreshToken) => {
  const index = user.refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    user.refreshTokens.splice(index, 1);
    const newRefreshToken = generateRefreshToken(user._id, user.role);
    user.refreshTokens.push(newRefreshToken);
    await user.save();
    return newRefreshToken;
  }
  return null;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  hashPassword,
};
