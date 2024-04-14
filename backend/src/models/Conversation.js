const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlord',
    required: true,
  },
  messages: [
    {
      sender: String,
      message: String,
      timeStamp: { type: Date, default: Date.now() },
    },
  ],
});

module.exports = mongoose.model('Conversation', conversationSchema);
