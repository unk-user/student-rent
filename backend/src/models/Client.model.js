const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String },
  school: { type: String },
  age: { type: Number }
});

module.exports = mongoose.model('Client', clientSchema);