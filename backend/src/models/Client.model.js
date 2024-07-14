const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const clientSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true,
    unique: true,
  },
  preferences: {
    city: String,
    school: String,
    budget: Number,
  },
  savedPosts: [{ type: ObjectId, ref: 'Request' }],
  savedListings: [{ type: ObjectId, ref: 'RentalListing' }],
});

clientSchema.index({ userId: 1, 'preferences.budget': 1 });

module.exports = mongoose.model('Client', clientSchema);
module.exports = mongoose.model('Client', clientSchema);
