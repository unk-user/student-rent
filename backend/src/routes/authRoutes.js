const express = require('express');
const router = express.Router();
const {loginUser, registerUser, regenToken} = require('../controllers/authControllers');

router.post('/login', loginUser);
router.post('/register', registerUser); 
router.post('/refresh', regenToken), 

module.exports = router;