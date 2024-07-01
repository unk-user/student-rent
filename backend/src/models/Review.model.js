const mongoose = require('mongoose');
const RentalListing = require('./RentalListing.model');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const reviewSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  rentalListingId: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
    required: true,
    index: true,
  },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now, immutable: true },
});

reviewSchema.post('save', async (review, next) => {
  try {
    const rentalListing = await RentalListing.findById(review.rentalListingId);
    const reviewCount = rentalListing.interactionSummary.reviewCount;
    const reviewAvg = rentalListing.interactionSummary.reviewAvg;
    const newAvg =
      reviewCount > 0
        ? (reviewAvg * reviewCount + review.rating) / (reviewCount + 1)
        : review.rating;
    rentalListing.interactionSummary.reviewAvg = Number(newAvg.toFixed(2));
    rentalListing.interactionSummary.reviewCount++;

    console.log(rentalListing.interactionSummary.reviewAvg);
    await rentalListing.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
