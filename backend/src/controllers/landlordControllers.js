const Landlord = require('../models/Landlord.model');
const RentalListing = require('../models/RentalListing.model');
const Client = require('../models/Client.model');

const getListings = async (req, res) => {
  const userId = req.userId;
  try {
    const landlord = await Landlord.findOne({ userId }).populate({
      path: 'properties',
      model: 'RentalListing',
      populate: {
        path: 'students',
        model: 'Client',
      },
    });
    if (!landlord) return res.sendStatus(403);
    const listings = landlord.properties;
    return res.json({ listings });
  } catch (error) {
    console.error('error fetching landlord listings:', error);
    return res.json({ error });
  }
};

const getListing = async (req, res) => {
  const userId = req.userId;
  const { listingId } = req.params;
  try {
    const rentalListing = await RentalListing.findById(listingId).populate(
      'students'
    );
    const landlord = await Landlord.findOne({ userId });
    const landlordId = landlord._id;
    if (!rentalListing || !landlord)
      return res.status(404).json({ userId, listingId });
    if (!rentalListing.landlordId.equals(landlordId))
      return res.sendStatus(403);
    return res.json({ rentalListing });
  } catch (error) {
    console.error('error fetching listing:', error);
    return res.json({ error });
  }
};

const createListing = async (req, res) => {
  const userId = req.userId;
  try {
    const landlord = await Landlord.findOne({ userId });
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

const updateListing = async (req, res) => {
  const { listingId } = req.params;
  const { title, description, location, price, rooms, students, images } =
    req.body;

  try {
    const rentalListing = await RentalListing.findByIdAndUpdate(
      listingId,
      {
        title,
        description,
        location,
        price,
        rooms,
        students,
        images,
      },
      { new: true, runValidators: true }
    );
    if (!rentalListing) {
      return res.status(404).json({ error: 'Rental listing not found' });
    }

    res.json(rentalListing);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const addStudent = async (req, res) => {
  const { clientId } = req.body;
  const { listingId } = req.params;
  try {
    const student = await Client.findById(clientId);
    const listing = await RentalListing.findById(listingId);
    if (!student || !listing) return res.sendStatus(404);
    if (listing?.students.includes(clientId)) return res.sendStatus(400);
    listing.students.push(clientId);
    await listing.save();
    return res.json(listing);
  } catch (error) {
    console.error(`error adding student ${clientId}:`, error);
    return res.sendStatus(500);
  }
};

const deleteListing = async (req, res) => {
  const { listingId } = req.params;
  try {
    const deletedListing = RentalListing.findByIdAndDelete(listingId);
    if (!deletedListing) return res.sendStatus(404);
    return res
      .status(204)
      .json({ message: 'successfully deleted', deleteListing });
  } catch (error) {
    console.error(`error deleting rental listing:`, error);
    return res.json('error deleting property');
  }
};

const deleteStudent = async (req, res) => {
  const { listingId } = req.params;
  const { clientId } = req.body;
  try {
    const listing = RentalListing.findById(listingId);
    if (!listing) return res.sendStatus(404);
    const updatedStudentList = listing.students.filter(
      (student) => student !== clientId
    );
    listing.students = updatedStudentList;
    await listing.save();
    return res.status(204).json({ clientId });
  } catch (error) {
    console.error(`error removing student:`, error);
    return res.json('error removing student from rental listing');
  }
};

module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  addStudent,
  deleteStudent,
  deleteListing,
};
