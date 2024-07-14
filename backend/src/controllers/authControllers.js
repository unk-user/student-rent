const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../helpers/authHelpers');
const User = require('../models/User.model');

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log('no refresh token');
    return res.sendStatus(401);
  }
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
  });

  const user = await User.findOne({ refreshTokens: { $in: [refreshToken] } });

  //Detected reuse!
  if (!user) {
    console.log('cannot find user');
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return; //Forbiden
        const hackedUser = await User.findById(decoded.userId);
        if(!hackedUser) return res.sendStatus(403);
        hackedUser.refreshTokens = [];
        await hackedUser.save();
        console.log(err);
      }
    );
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const newRefreshTokenArray = user.refreshTokens.filter(
        (rt) => rt !== refreshToken
      );
      if (err) {
        console.log('error verify token', err);
        user.refreshTokens = [...newRefreshTokenArray];
        await user.save();
      }
      if (err || user._id.toString() != decoded.userId) {
        return res.sendStatus(401);
      }
      const accessToken = generateAccessToken(decoded.userId, decoded.role);
      const newRefreshToken = generateRefreshToken(
        decoded.userId,
        decoded.role
      );

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { refreshTokens: [...newRefreshTokenArray, newRefreshToken] },
        },
        { new: true }
      );

      if (!updatedUser) {
        console.log('Conflict detected during refresh token update');
        return res.sendStatus(409); // Conflict error
      }

      res.cookie('refreshToken', newRefreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      });

      const { password, refreshTokens, ...filteredUser } =
        updatedUser.toObject();

      return res.json({ accessToken, user: filteredUser });
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
