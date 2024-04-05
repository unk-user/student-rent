const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String },
  school: { type: String }
});

module.exports = mongoose.model('Client', clientSchema);