const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  city: String,
  school: String,
  bookmarks: [{type: Schema.Types.ObjectId, ref: 'RentalListing'}]
});

module.exports = mongoose.model('Client', clientSchema);