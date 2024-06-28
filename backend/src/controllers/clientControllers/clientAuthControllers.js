const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} = require('../../helpers/authHelpers');
const User = require('../../models/User.model');
const Client = require('../../models/Client.model');

const loginClient = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'User not found. Please check your email and try again.',
      });
    }

    if (user.role === 'landlord') {
      return res
        .status(403)
        .json({ message: 'You do not have permission to access this page.' });
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return res
        .status(403)
        .json({ message: 'Incorrect password. Please try again.' });
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
        sameSite: 'Lax',
      });

    user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
    const result = await user.save();
    console.log(result);

    const { refreshTokens, hash, ...userWithoutRefreshTokens } = user.toObject();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accessToken,
      user: userWithoutRefreshTokens,
    });
  } catch (error) {
    console.error('login error:', error);
  }
};

const registerClient = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password, school, city, budget } =
    req.body;
  try {
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];

    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email already exists, login instead' });
    }

    const hash = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      hash,
      role: 'client',
    });

    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id, newUser.role);
    newUser.refreshTokens = [refreshToken];

    const newClient = new Client({
      userId: newUser._id,
    });

    newClient.preferences = {
      city: city || null,
      school: school || null,
      budget: budget || null,
    };

    await newUser.save();
    await newClient.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
    res.status(201).json({
      accessToken,
      newUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginClient,
  registerClient,
};
