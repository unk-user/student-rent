const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;
const RentalListing = require('./RentalListing.model');

const rentalListingViewSchema = new Schema({
  rentalListingId: {
    type: ObjectId,
    ref: 'RentalListing',
    required: true,
    index: true,
  },
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
});

rentalListingViewSchema.pre(
  'save',
  async function onSave(rentalListingLike, next) {
    const { rentalListingId } = rentalListingLike;
    try {
      const rentalListing = await RentalListing.findById(rentalListingId);
      rentalListing.interactionSummary.viewCount++;
      await rentalListing.save();
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model('RentalListingView', rentalListingViewSchema);
