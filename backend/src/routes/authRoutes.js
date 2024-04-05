const express = require('express');
const router = express.Router();
const {loginUser, registerUser, refreshAccessToken, logoutUser} = require('../controllers/authControllers');

router.post('/login', loginUser);
router.post('/register', registerUser); 
router.post('/refresh', refreshAccessToken), 
router.post('/logout', logoutUser);

module.exports = router;