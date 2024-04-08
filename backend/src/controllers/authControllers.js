const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} = require('../helpers/authHelpers');
const User = require('../models/User.model');
const Client = require('../models/Client.model');
const Landlord = require('../models/Landlord.model');

const loginUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
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

    const accessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);
    const newRefreshTokenArray = !refreshToken
      ? user.refreshTokens
      : user.refreshTokens.filter((rt) => rt !== refreshToken);
    if (refreshToken)
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

    user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
    const result = await user.save();
    console.log(result);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accessToken,
      username: user.username,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error('login error:', error);
  }
};

const registerUser = async (req, res) => {
  console.log(req.body);
  const { username, email, password, role, school, city } = req.body;
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

    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id, newUser.role);
    newUser.refreshTokens = [refreshToken];
    await newUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(201).json({
      accessToken,
      username,
      role,
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  const user = await User.findOne({ refreshTokens: refreshToken }).exec();

  //Detected reuse!
  if (!user) {
    console.log('cannot find user');
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return; //Forbiden
        const hackedUser = await User.findById(decoded.userId);
        hackedUser.refreshTokens = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    console.log('error here');
    return res.sendStatus(403);
  }

  const username = user.username;
  const role = user.role;
  const userId = user._id;
  const newRefreshTokenArray = user.refreshTokens.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log('error verify token');
        user.refreshTokens = [...newRefreshTokenArray];
        const result = await user.save();
      }
      if (err || user._id.toString() !== decoded.userId) {
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken(decoded.userId, decoded.role);
      const newRefreshToken = generateRefreshToken(
        decoded.userId,
        decoded.role
      );

      const userVersion = user.__v;

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, __v: userVersion },
        {
          $set: { refreshTokens: [...newRefreshTokenArray, newRefreshToken] },
          $inc: { __v: 1 },
        },
        { new: true }
      );

      if (!updatedUser) {
        console.log('Conflict detected during refresh token update');
        return res.sendStatus(409); // Conflict error
      }
      await updatedUser.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.json({ accessToken, username, role, userId });
    }
  );
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); //No content

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return res.sendStatus(204);
  }

  user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
  const result = await user.save();
  console.log(result);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  return res.sendStatus(204);
};

module.exports = {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
};
