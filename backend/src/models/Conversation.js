const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      sender: String,
      message: String,
      timeStamp: { type: Date, default: Date.now() },
    },
  ],
});

module.exports = mongoose.model('Conversation', conversationSchema);
