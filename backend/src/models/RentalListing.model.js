const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Landlord = require('./Landlord.model');

const detailsSchema = new Schema({
  title: { type: String, required: true },
  About: { type: String, required: true },
  location: { type: String, required: true, index: 1 },
  city: { type: String, required: true },
  period: {
    type: String,
    enum: ['academic year', 'semester', 'monthly', 'weekly', 'daily', 'any'],
    default: 'any',
    index: 1,
  },
  price: { type: Number, required: true, index: 1 },
  rooms: Number,
  bathrooms: Number,
  area: Number,
  category: {
    type: String,
    enum: ['appartment', 'studio', 'room', 'house', 'dorm'],
  },
  images: [{ public_id: String, url: String }],
});

const rentalListingSchema = new Schema({
  landlordId: { type: ObjectId, ref: 'Landlord', required: true },
  details: { type: detailsSchema, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  reviewAvg: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{ type: ObjectId, ref: 'Review' }],
  interactions: {
    views: [{ type: ObjectId, ref: 'Client' }],
    likes: [{ type: ObjectId, ref: 'Client' }],
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

rentalListingSchema.post('save', async function onSave(rentalListing) {
  const { landlordId } = rentalListing;
  const landlord = await Landlord.findByIdAndUpdate(
    landlordId,
    { $push: { properties: rentalListing._id } },
    { new: true }
  );
  if (!landlord) throw new Error('Landlord not found');
});

module.exports = mongoose.model('RentalListing', rentalListingSchema);
