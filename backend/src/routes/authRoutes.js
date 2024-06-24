const express = require('express');
const router = express.Router();
const {
  refreshAccessToken,
  logoutUser,
} = require('../controllers/authControllers');

router.post('/refresh', refreshAccessToken), router.post('/logout', logoutUser);

module.exports = router;
