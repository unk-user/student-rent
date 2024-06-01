const RentalListing = require('../models/RentalListing.model');
const cloudinary = require('cloudinary').v2;
const Landlord = require('../models/Landlord.model');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const updateListing = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  const {
    title,
    description,
    location,
    price,
    rooms,
    students,
    images,
    removedImages,
  } = req.body;
  try {
    const landlordId = await Landlord.find({ userId }).select('_id');
    const rentalListing = await RentalListing.findById(listingId)
      .where('landlordId')
      .equals(landlordId);

    if (!rentalListing) {
      return res.status(404).json({ error: 'Rental listing not found' });
    }

    if (removedImages) {
      await Promise.all(
        removedImages.map((public_id) =>
          cloudinary.uploader.destroy(public_id, { invalidate: true })
        )
      );
      console.log('Destroyed');
    }

    if (title) rentalListing.title = title;
    if (description) rentalListing.description = description;
    if (location) rentalListing.location = location;
    if (price) rentalListing.price = price;
    if (rooms) rentalListing.rooms = rooms;
    if (students) rentalListing.students = students;
    if (images) rentalListing.images = images;
    await rentalListing.save();

    res.json(rentalListing);
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = updateListing;
