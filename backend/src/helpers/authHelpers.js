const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (userId, role) => {
  if (role === 'client') {
    const token = jwt.sign({userId, role}, process.env.CLIENT_SECRET, { expiresIn: '1h' });
    return token;
  } else if (role === 'landlord') {
    const token = jwt.sign({userId, role}, process.env.LANDLORD_SECRET, { expiresIn: '1h' });
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
