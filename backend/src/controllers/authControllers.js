const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken, hashPassword } = require('../helpers/authHelpers');
const User = require('../models/User.model');
const Client = require('../models/Client.model');
const Landlord = require('../models/Landlord.model');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return res.status(401).json({ message: 'wrong password' });
    }
    const token = generateToken(user._id, user.role, '15m');
    const tokenExpiration = Date.now() + 15 * 60 * 1000;
    const refreshToken = generateToken(user._id, user.role, '24h');

    res.setHeader('Authorization', `Bearer ${token} ${refreshToken}`);
    res
      .status(200)
      .json({
        message: 'Login successfull',
        token,
        refreshToken,
        tokenExpiration,
      });
  } catch (error) {
    console.error('login error:', error);
  }
};

const registerUser = async (req, res) => {
  console.log(req.body);
  const { username, email, password, role, school, age, city } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists, login instead' });
    }

    const hash = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      hash,
      role,
    });

    await newUser.save();
    if (role === 'landlord') {
      const newLandlord = new Landlord({
        userId: newUser._id,
        properties: [],
      });

      await newLandlord.save();
    } else if (role === 'client') {
      const newClient = new Client({
        userId: newUser._id,
        city,
        school,
        age,
      });

      await newClient.save();
    }
    const token = generateToken(newUser._id, newUser.role);
    const tokenExpiration = Date.now() + 15 * 60 * 1000;
    const refreshToken = generateToken(newUser._id, newUser.role, '24h');

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({ message: 'User registered successfully', token, refreshToken, tokenExpiration });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const regenToken = async (req, res) => {
  const refreshToken = req.headers.authorization?.split(' ')[2];
  try {
    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const decode = jwt.verify(refreshToken, process.env.SECRET);
    const token = generateToken(decode.userId, decode.role, '15m');
    res.json({ token });
  } catch (error) {
    console.error('invalid token');
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  regenToken,
};
