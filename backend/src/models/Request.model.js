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
  details: {
    numberOfRoommatesNeeded: { type: Number, required: true },
    numberOfRoommatesApplied: { type: Number, default: 1 },
    message: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

//create index

requestSchema.index({ userId: 1, listingId: 1 });

requestSchema.post('save', async function onSave(request) {
  const { listingId } = request;
  const rentalListing = await RentalListing.findById(listingId);
  rentalListing.requests.push(request._id);
  await rentalListing.save();
});

requestSchema.post('remove', async function onRemove(request) {
  const { listingId } = request;
  const rentalListing = await RentalListing.findById(listingId);
  rentalListing.requests.pull(request._id);
  await rentalListing.save();
});

requestSchema.index({ clientId, ownerId });

module.exports = mongoose.model('Request', requestSchema);
