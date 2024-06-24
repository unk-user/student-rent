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

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
  });

  const user = await User.findOne({ refreshTokens: refreshToken });

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
    return res.sendStatus(403);
  }

  const firstName = user.firstName;
  const role = user.role;
  const userId = user._id;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const newRefreshTokenArray = user.refreshTokens.filter(
        (rt) => rt !== refreshToken
      );
      if (err) {
        console.log('error verify token');
        user.refreshTokens = [...newRefreshTokenArray];
        await user.save();
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
        sameSite: 'Lax',
      });

      return res.json({ accessToken, firstName, role, userId });
    }
  );
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); //No content

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: true,
    });
    return res.sendStatus(204);
  }

  user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
  const result = await user.save();
  console.log(result);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
  });
  return res.sendStatus(204);
};

module.exports = {
  refreshAccessToken,
  logoutUser,
};
