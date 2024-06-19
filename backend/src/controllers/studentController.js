const RentalListing = require('../models/RentalListing.model');
const Client = require('../models/Client.model');

const getListings = async (req, res) => {
  //TODO: Integrate the controller with a recommendation system
  
};

const getListing = async (req, res) => {
  const listingId = req.params.id;
  try {
    const listing = await RentalListing.findById(listingId)
      .populate({
        path: 'students',
        populate: {
          path: 'userId',
          model: 'User',
          select: '-refreshTokens -hash',
        },
      })
      .populate({
        path: 'landlordId',
        populate: {
          path: 'userId',
          model: 'User',
          select: '-refreshTokens -hash',
        },
      });
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

module.exports = {
  getListings,
  getListing,
  bookmarkListing,
  removeListingBookmark,
};
