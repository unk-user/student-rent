const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');

const getConversations = async (req, res) => {
  const userId = req.userId;
  try {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: 'messages',
          let: { localField: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$conversationId', '$$localField'] },
                    { $ne: ['$sender', userId] },
                    { $ne: ['$readBy', userId] },
                  ],
                },
              },
            },
          ],
          as: 'unreadMessages',
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    const userData = await User.findById(userId).select({
      hash: 0,
      refreshTokens: 0,
    });
    if (!userData) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getUserData,
};
