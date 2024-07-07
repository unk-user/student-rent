const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
