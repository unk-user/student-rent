const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  role: { type: String, enum: ['client', 'landlord'], default: 'client' },
  refreshTokens: [String]
});

module.exports = mongoose.model('User', userSchema);