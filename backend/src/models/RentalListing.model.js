const mongoose = require('mongoose');
const Landlord = require('../models/Landlord.model');
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

rentalListingSchema.post('save', async (rentalListing, next) => {
  try {
    const landlord = await Landlord.findById(rentalListing.landlordId);
    landlord.properties.push(rentalListing._id);
    await landlord.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('RentalListing', rentalListingSchema);
