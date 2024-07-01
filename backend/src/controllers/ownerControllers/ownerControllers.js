const Landlord = require('../../models/Landlord.model');
const RentalListing = require('../../models/RentalListing.model');

const createListing = async (req, res) => {
  const userId = req.userId;
  const { details } = req.body;

  try {
    const landlord = await Landlord.findOne({ userId });
    const newListing = new RentalListing({
      landlordId: landlord._id,
      userId,
      details,
    });

    if (req.files) {
      const images = req.files.map((image) => {
        return {
          public_id: image.filename,
          url: image.path,
        };
      });
      newListing.details.images = images;
    }

    await newListing.save();
    res.status(201).json({ message: 'Listing created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating listing' });
  }
};

module.exports = {
  createListing,
};


