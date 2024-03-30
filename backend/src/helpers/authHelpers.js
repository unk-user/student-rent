const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (userId, role, expiration) => {
  if (role) {
    const token = jwt.sign({ userId, role }, process.env.SECRET, {
      expiresIn: expiration,
    });
    return token;
  } else {
    return null;
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

module.exports = {
  generateToken,
  hashPassword,
};
