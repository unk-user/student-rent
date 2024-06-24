const mongoose = require('mongoose');
const RentalListing = require('./RentalListing.model');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const reviewSchema = new Schema({
  client: { type: ObjectId, ref: 'Client', required: true },
  rentalListing: {
    type: Schema.Types.ObjectId,
    ref: 'RentalListing',
    required: true,
  },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now, immutable: true },
});

reviewSchema.pre('save', async (review, next) => {
  try {
    const rentalListing = await RentalListing.findById(review.rentalListing);
    const reviewCount = rentalListing.interactionSummary.reviewCount;
    const reviewAvg = rentalListing.interactionSummary.reviewAvg;
    const newAvg =
      reviewCount > 0
        ? (reviewAvg * reviewCount + review.rating) / (reviewCount + 1)
        : review.rating;
    rentalListing.interactionSummary.reviewAvg = newAvg;
    rentalListing.interactionSummary.reviewCount++;

    console.log(rentalListing.interactionSummary.reviewAvg);
    await rentalListing.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
