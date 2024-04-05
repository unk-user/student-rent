const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  rotateRefreshToken,
} = require('../helpers/authHelpers');
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
      return res.status(403).json({ message: 'wrong password' });
    }

    const token = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({
      token,
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
      return res
        .status(400)
        .json({ message: 'Email already exists, login instead' });
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
      });

      await newClient.save();
    }
    const token = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id, newUser.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(201).json({
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) res.status(401);

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) return res.sendStatus(403);

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.sendStatus(403);
  }
  const newRefreshToken = await rotateRefreshToken(user, refreshToken);
  if (!newRefreshToken) return res.sendStatus(403);

  const accessToken = generateAccessToken(user._id, user.role);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.json({ accessToken });
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) return res.sendStatus(204);

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );
  await user.save();

  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

module.exports = {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
};
