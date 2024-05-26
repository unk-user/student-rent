const express = require('express');
const router = express.Router();
const {loginOwner, loginStudent, registerUser, refreshAccessToken, logoutUser} = require('../controllers/authControllers');

router.post('/landlord/login', loginOwner);
router.post('/student/login', loginStudent)
router.post('/register', registerUser); 
router.post('/refresh', refreshAccessToken), 
router.post('/logout', logoutUser);

module.exports = router;