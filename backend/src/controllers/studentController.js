const RentalListing = require('../models/RentalListing.model');
const Client = require('../models/Client.model');
const Booking = require('../models/Booking.model');

const getListings = async (req, res) => {
  const userId = req.userId;
  const { offset = 0, limit = 8, filters = '[]', sort = '' } = req.query;
  const parsedFilters = JSON.parse(filters);
  const filter = parsedFilters.reduce((acc, curr) => {
    if (curr.field === 'price') {
      return { ...acc, price: { $gte: curr.min, $lte: curr.max } };
    }
    if (curr.field === 'period') {
      return curr.value === 'All'
        ? acc
        : { ...acc, period: curr.value.toLowerCase() };
    }
    if (curr.field === 'bathrooms') {
      return curr.value !== 0 ? { ...acc, bathrooms: curr.value } : acc;
    }
    if (curr.field === 'bedrooms') {
      return curr.value !== 0 ? { ...acc, rooms: curr.value } : acc;
    }
    if (curr.field === 'category') {
      return curr.value.toLowerCase() === 'all'
        ? acc
        : { ...acc, category: curr.value.toLowerCase() };
    }
    return acc;
  }, {});
  const parsedSort = sort ? JSON.parse(sort) : {};
  const sortOptions = {};
  if (parsedSort.field && parsedSort.sort) {
    sortOptions[parsedSort.field] = Number(parsedSort.sort);
  }
  console.log(filter, sortOptions);
  try {
    const client = await Client.findOne({ userId });
    const listings = await RentalListing.find({ ...filter, city: client.city })
      .sort(sortOptions)
      .skip(offset)
      .limit(limit);

    const recomendedBookings = await Booking.find({
      rentalListingId: { $in: listings.map((l) => l._id) },
      school: client.school,
    }).populate('rentalListingId');
    const recomendedListings = recomendedBookings.map((b) => b.rentalListingId);

    return res.json({
      listings,
      recomendedListings,
    });
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
      school: client.school,
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
