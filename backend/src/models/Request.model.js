const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  landlordId: { type: Schema.Types.ObjectId, ref: 'Landlord', required: true },
  rentalListingId: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: String,
});

requestSchema.index({ clientId: 1, landlordId: 1 });
requestSchema.index({ rentalListingId: 1, clientId: 1 });
requestSchema.index({ rentalListingId: 1, landlordId: 1 });

module.exports = mongoose.model('Request', requestSchema);
