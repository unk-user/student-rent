const Landlord = require('../models/Landlord.model');
const User = require('../models/User.model');
const RentalListing = require('../models/RentalListing.model');
const Booking = require('../models/Booking.model');

const getListings = async (req, res) => {
  const userId = req.userId;
  try {
    const landlord = await Landlord.findOne({ userId: userId }).populate(
      'properties'
    );
    if (!landlord) return res.sendStatus(403);
    const listings = landlord.properties;
    return res.json({ listings });
  } catch (error) {
    console.error('error fetching landlord listings:', error);
    return res.json({ error });
  }
};

const createListing = async (req, res) => {
  const userId = req.userId;
  try {
    const landlord = await Landlord.findOne({ userId: userId });
    const landlordId = landlord._id;
    const newListing = new RentalListing({ ...req.body, landlordId });
    await newListing.save();

    res
      .status(201)
      .json({ message: 'Listing created successfully!', listing: newListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating listing' });
  }
};

module.exports = { getListings, createListing };
