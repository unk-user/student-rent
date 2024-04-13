const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  rentalListingId: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
    required: true,
  },
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model('Booking', bookingSchema);
