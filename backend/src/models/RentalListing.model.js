const mongoose = require('mongoose');
const Landlord = require('./Landlord.model');
const Schema = mongoose.Schema;

const rentalListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  period: {
    type: String,
    enum: ['monthly', 'yearly', 'semester'],
    default: 'monthly',
  },
  price: { type: Number, required: true },
  rooms: Number,
  bathrooms: Number,
  images: [{ public_id: String, url: String }],
  category: {
    type: String,
    enum: ['appartment', 'studio', 'room', 'dorm'],
  },
  landlordId: { type: Schema.Types.ObjectId, ref: 'Landlord', required: true }, 
  createdAt: { type: Date, default: Date.now, immutable: true }, 
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
