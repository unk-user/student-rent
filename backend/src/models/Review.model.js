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
    rentalListing.reviews.push(review._id);
    rentalListing.reviewAvg =
      rentalListing.reviewCount > 0
        ? (rentalListing.reviewAvg * rentalListing.reviewCount +
            review.rating) /
          (rentalListing.reviewCount + 1)
        : review.rating;
    rentalListing.reviewCount++;

    console.log(rentalListing.reviewAvg);
    await rentalListing.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
