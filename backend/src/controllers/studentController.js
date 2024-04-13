const RentalListing = require('../models/RentalListing.model');
const Client = require('../models/Client.model');
const Booking = require('../models/Booking.model');
const { Types } = require('mongoose');

const getListings = async (req, res) => {
  const { offset = 0, limit = 12, filters = '[]', sort = '' } = req.query;
  const parsedFilters = JSON.parse(filters);
  const filter = parsedFilters.reduce((acc, curr) => {
    if (curr.field === 'price') {
      return { ...acc, price: { $gte: curr.min, $lte: curr.max } };
    }
    if (curr.field === 'period') {
      return curr.value === 'All' ? acc : { ...acc, category: curr.value };
    }
    if (curr.field === 'bathrooms') {
      return { ...acc, bathrooms: curr.value };
    }
    if (curr.field === 'rooms') {
      return { ...acc, bedrooms: curr.value };
    }
    return acc;
  }, {});
  const parsedSort = sort ? JSON.parse(sort) : {};
  const sortOptions = {};
  if (parsedSort.field && parsedSort.direction) {
    sortOptions[parsedSort.field] = Number(parsedSort.direction);
  }
  console.log(filter, sortOptions);
  try {
    const listings = await RentalListing.find(filter)
      .sort(sortOptions)
      .skip(offset)
      .limit(limit);
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
};

const getListing = async (req, res) => {
  const listingId = req.params.id;
  try {
    const listing = await RentalListing.findById(listingId);
    if (!listing) return res.sendStatus(404);
    return res.json({ listing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const bookmarkListing = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.userId;
  if (req.role === 'landlord') return res.sendStatus(403);
  try {
    const client = await Client.findOne({ userId });
    if (!client) return res.sendStatus(404);
    if (client.bookmarks.includes(listingId)) return res.sendStatus(200);
    client.bookmarks.push(listingId);
    await client.save();
    return res.json({ client });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

const removeListingBookmark = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.userId;
  if (req.role === 'landlord') return res.sendStatus(403);
  try {
    const client = await Client.findOne({ userId });
    if (!client) return res.sendStatus(404);
    const newBookmarks = client.bookmarks.filter((id) => {
      return !id.equals(listingId);
    });
    client.bookmarks = newBookmarks;
    console.log(newBookmarks, client);
    await client.save();
    return res.json({ client });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

const bookListing = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.userId;
  const { startDate, endDate } = req.body;
  if (req.role === 'landlord') return res.sendStatus(403);
  try {
    const client = await Client.findOne({ userId });
    const listing = await RentalListing.findById(listingId);
    if (!client || !listing) return res.sendStatus(404);
    const booking = await Booking.find({
      clientId: client._id,
      rentalListingId: listingId,
    });
    if (booking.length > 0) return res.sendStatus(409);

    const newBooking = await Booking.create({
      clientId: client._id,
      rentalListingId: listingId,
      startDate,
      endDate,
    });
    return res.json({ newBooking });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

const cancelBooking = async (req, res) => {
  const userId = req.userId;
  const listingId = req.params.id;
  try {
    const client = await Client.findOne({ userId });
    if (!client) return res.sendStatus(404);
    const deletedBooking = await Booking.findOneAndDelete({
      clientId: client._id,
      rentalListingId: listingId,
    });
    return res.status(204).json({ deletedBooking });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

module.exports = {
  getListings,
  getListing,
  bookmarkListing,
  removeListingBookmark,
  bookListing,
  cancelBooking,
};
