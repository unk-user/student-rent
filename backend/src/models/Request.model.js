const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RentalListing = require('./RentalListing.model');
const Client = require('./Client.model');

const requestSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
  },
  details: {
    numberOfRoommatesTotal: { type: Number, required: true },
    numberOfRoommatesApplied: { type: Number, default: 1 },
    preferences: [{ type: String }],
    message: { type: String, required: true },
  },
  city: { type: String },
  budget: { type: Number },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

//create index

requestSchema.index({ listingId: 1 });
requestSchema.index({ userId: 1 });
requestSchema.index({ city: 1, createdAt: -1 });

requestSchema.pre('save', async function preSave(next) {
  const { listingId } = this;
  if (this.isNew && listingId) {
    const listing = await RentalListing.findById(listingId);
    listing.requests.push(this._id);
    await listing.save();
    this.budget = Math.round(listing.details.price / this.details.numberOfRoommatesTotal);
    this.city = listing.details.city;
    this.status = 'pending';
  } else if (this.isNew) {
    const client = await Client.findOne({ userId: this.userId });
    this.city = client.preferences.city;
    this.budget = this.budget || client.preferences.budget;
  }
  next();
});

requestSchema.post('remove', async function onRemove(request) {
  const { listingId } = request;
  if (listingId) {
    await RentalListing.findByIdAndUpdate(listingId, {
      $pull: { requests: request._id },
    });
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema);
