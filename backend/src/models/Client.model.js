const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const clientSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
  likes: [{ type: ObjectId, ref: 'RentalListing' }],
});

// create index on budget field
clientSchema.index({ userId: 1, 'preferences.budget': 1 });

module.exports = mongoose.model('Client', clientSchema);
module.exports = mongoose.model('Client', clientSchema);
