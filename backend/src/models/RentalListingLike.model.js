const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;
const RentalListing = require('./RentalListing.model');

const rentalListingLikeSchema = new Schema({
  rentalListingId: {
    type: ObjectId,
    ref: 'RentalListing',
    required: true,
    index: true,
  },
  clientId: { type: ObjectId, ref: 'Client', required: true, index: true },
});

rentalListingLikeSchema.pre(
  'save',
  async function onSave(rentalListingLike, next) {
    const { rentalListingId } = rentalListingLike;
    try {
      const rentalListing = await RentalListing.findById(rentalListingId);
      rentalListing.interactionSummary.likeCount++;
      await rentalListing.save();
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model('RentalListingLike', rentalListingLikeSchema);
