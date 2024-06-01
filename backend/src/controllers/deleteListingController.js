const RentalListing = require('../models/RentalListing.model');
const cloudinary = require('cloudinary').v2;
const Landlord = require('../models/Landlord.model');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const deleteListing = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  try {
    const LandlordId = await Landlord.find({ userId }).select('_id');
    const Listing = await RentalListing.findById(listingId)
      .where('landlordId')
      .equals(LandlordId);

    if (!Listing) {
      return res.status(404).json({ error: 'Rental listing not found' });
    }

    if (Listing.images) {
      console.log(Listing.images);
      await Promise.all(
        Listing.images.map((public_id) =>
          cloudinary.uploader.destroy(public_id, { invalidate: true })
        )
      );
      //log cloudinary results
    }
    const deletedListing = await Listing.deleteOne();

    if (!deletedListing) {
      return res.sendStatus(404);
    }
    return res
      .status(204)
      .json({ message: 'successfully deleted', deleteListing });
  } catch (error) {
    console.error(`error deleting rental listing:`, error);
    return res.json('error deleting property');
  }
};

module.exports = deleteListing;
