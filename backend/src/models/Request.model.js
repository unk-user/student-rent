const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RentalListing = require('./RentalListing.model');

const requestSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  details: {
    numberOfRoommatesNeeded: { type: Number, required: true },
    numberOfRoommatesApplied: { type: Number, default: 1 },
    preferences: [{ type: String }],
    message: { type: String, required: true },
  },
  price: { type: Number },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

//create index

requestSchema.index({ userId: 1, listingId: 1 });

requestSchema.pre('save', async function preSave(next) {
  if (this.isNew) {
    const { listingId } = this;
    const listing = await RentalListing.findById(listingId);
    listing.requests.push(this._id);
    await listing.save();
    this.price = listing.details.price;
  }
  next();
});

requestSchema.post('remove', async function onRemove(request) {
  const { listingId } = request;
  await RentalListing.findByIdAndUpdate(listingId, {
    $pull: { requests: request._id },
  });
  next();
});

module.exports = mongoose.model('Request', requestSchema);
