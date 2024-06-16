const Landlord = require('../models/Landlord.model');
const RentalListing = require('../models/RentalListing.model');

const getListings = async (req, res) => {
  const userId = req.userId;
  const { limit = 10, page = 1, sortField = 'createdAt', sortDirection = -1 } = req.query;
  const offset = (page - 1) * limit;
  console.log(limit);

  try {
    //TODO: add limit to the query
    const landlord = await Landlord.findOne({ userId }).populate({
      path: 'properties',
      model: 'RentalListing',
      limit: limit,
      skip: offset,
      options: { sort: { [sortField]: parseInt(sortDirection) } },
      populate: {
        path: 'students',
        model: 'Client',
      },
    });
    if (!landlord) return res.sendStatus(403);
    const totalProperties = await RentalListing.countDocuments({
      landlordId: landlord._id,
    });

    const totalPages = Math.ceil(totalProperties / limit);

    const listings = landlord.properties;
    return res.json({ listings, totalPages });
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

//deprecated
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

const deleteListing = async (req, res) => {
  const { listingId } = req.params;
  console.log(listingId);
  try {
    const deletedListing = await RentalListing.findByIdAndDelete(listingId);
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


module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
};
