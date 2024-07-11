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
                    { $ne: ['$sender', new mongoose.Types.ObjectId(userId)] },
                    {
                      $not: {
                        $in: [new mongoose.Types.ObjectId(userId), '$readBy'],
                      },
                    },
                  ],
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'newMessagesCount',
        },
      },
    ]);
    await User.populate(conversations, {
      path: 'participants',
      select: { hash: 0, refreshTokens: 0 },
    });

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

const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { pageCursor } = req.query;

  try {
    let query = { conversationId: conversationId };

    if (pageCursor) {
      const pointedMessage = await Message.findById(pageCursor);
      if (!pointedMessage) {
        throw new Error('Invalid cursor');
      }
      query.createdAt = { $lt: pointedMessage.createdAt };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(21)
      .lean();

    const hasMore = messages.length === 21;
    const paginatedMessages = hasMore ? messages.slice(0, -1) : messages;

    return res.status(200).json({
      messages: paginatedMessages,
      hasMore,
      nextCursor: hasMore
        ? paginatedMessages[paginatedMessages.length - 1]._id
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getUserData,
  getMessages,
};
