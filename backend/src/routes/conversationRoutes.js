const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const conversationControllers = require('../controllers/conversationControllers');

router.use(verifyToken);

router.get('/', conversationControllers.getConversations);
router.get('/:conversationId/messages', conversationControllers.getMessages);
router.get('/users/:userId', conversationControllers.getUserData);

module.exports = router;
