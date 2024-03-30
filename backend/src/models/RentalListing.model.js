const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rooms: { type: Number, required: true },
  images: [{type: String}],
  landlordId: { type: Schema.Types.ObjectId, ref: 'Landlord', required: true }
});

module.exports = mongoose.model('RentalListing', rentalListingSchema);
