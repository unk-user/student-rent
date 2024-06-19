const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  landlord: { type: Schema.Types.ObjectId, ref: 'Landlord', required: true },
  rentalListing: {
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

requestSchema.index({ client: 1, landlord: 1 });
requestSchema.index({ rentalListing: 1, client: 1 });
requestSchema.index({ rentalListing: 1, landlord: 1 });

module.exports = mongoose.model('Request', requestSchema);
