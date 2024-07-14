const RentalListing = require('../../models/RentalListing.model');
const Client = require('../../models/Client.model');
const RentalListingLike = require('../../models/RentalListingLike.model');
const RentalListingView = require('../../models/RentalListingView.model');
const Review = require('../../models/Review.model');
const mongoose = require('mongoose');
const Request = require('../../models/Request.model');

const getListings = async (req, res) => {
  const userId = req.userId;
  const {
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    location,
    rentPeriod,
    category,
  } = req.query;
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const client = await Client.findOne({ userId });

    let query = {
      ...(client.preferences.city && {
        'details.city': client.preferences.city,
      }),
      ...(maxPrice &&
        minPrice && {
          'details.price': {
            $lte: parseInt(maxPrice),
            $gte: parseInt(minPrice),
          },
        }),
      ...(location && location !== 'Any' && { 'details.location': location }),
      ...(rentPeriod &&
        rentPeriod !== 'any' && { 'details.period': rentPeriod }),
      ...(category && category !== 'all' && { 'details.category': category }),
      status: 'active',
    };

    console.log(query);

    const listings = await RentalListing.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await RentalListing.countDocuments(query);

    res.json({
      listings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalListigs: total,
    });
  } catch (error) {
    console.error('Error fetching listings', error);
    res.status(500).json({ message: 'Error fetching listings', error });
  }
};

const getListing = async (req, res) => {
  const { listingId } = req.params;
  try {
    const listing = await RentalListing.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(listingId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'landlord',
        },
      },
      { $unwind: '$landlord' },
      {
        $lookup: {
          from: 'reviews',
          let: { listingId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$rentalListingId', '$$listingId'] },
              },
            },
            {
              $limit: 4,
            },
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userId',
              },
            },
            {
              $unwind: '$userId',
            },
          ],
          as: 'reviews',
        },
      },
      {
        $lookup: {
          from: 'rentallistinglikes',
          let: { listingId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$rentalListingId', '$$listingId'] },
                userId: new mongoose.Types.ObjectId(req.userId),
              },
            },
            { $count: 'count' },
          ],
          as: 'liked',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          let: { listingId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$rentalListingId', '$$listingId'] },
                userId: new mongoose.Types.ObjectId(req.userId),
              },
            },
            { $count: 'count' },
          ],
          as: 'reviewed',
        },
      },
      {
        $addFields: {
          liked: { $ifNull: [{ $arrayElemAt: ['$liked.count', 0] }, 0] },
          reviewed: { $ifNull: [{ $arrayElemAt: ['$reviewed.count', 0] }, 0] },
        },
      },
      {
        $project: {
          'landlord.refreshTokens': 0,
          'landlord.hash': 0,
          'landlord.__v': 0,
        },
      },
    ]);
    await RentalListing.populate(listing, {
      path: 'requests',
      populate: {
        path: 'userId',
      },
    });

    if (listing.length === 0) {
      console.log(listing);
      return res.status(404).json({ message: 'Listing not found' });
    }

    const viewedCookie = req.cookies[`viewed_${listing[0]._id}`];
    if (!viewedCookie) {
      const view = new RentalListingView({
        rentalListingId: listing[0]._id,
        userId: req.userId,
      });

      await view.save();
      res.cookie(`viewed_${listing[0]._id}`, true, {
        expires: new Date(Date.now() + 1000 * 60 * 5),
        httpOnly: true,
      });
    }

    res.json({
      listing: listing[0],
      reviews: listing.reviews,
      landlord: listing.landlord,
    });
  } catch (error) {
    console.error('Error fetching listing', error);
    res.json({ message: 'Error fetching listing', error: error.message });
  }
};

const addLike = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  try {
    const existingLike = await RentalListingLike.findOne({
      rentalListingId: listingId,
      userId,
    });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: 'You have already liked this listing' });
    }

    const like = new RentalListingLike({ rentalListingId: listingId, userId });
    await like.save();
    res.json({ message: 'Like added successfully', liked: true });
  } catch (error) {
    console.error('Error adding like', error);
    res
      .status(500)
      .json({ message: 'Error adding like', error: error.message });
  }
};
const removeLike = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  try {
    await RentalListingLike.deleteOne({ rentalListingId: listingId, userId });
    res.json({ message: 'Like removed successfully', liked: false });
  } catch (error) {
    console.error('Error removing like', error);
    res
      .status(500)
      .json({ message: 'Error removing like', error: error.message });
  }
};

const addReview = async (req, res) => {
  const { listingId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.userId;
  try {
    if (rating > 5 || rating < 1) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }
    const review = new Review({
      rentalListingId: listingId,
      userId,
      comment,
      rating,
    });
    await review.save();
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review', error);
    res.json({ message: 'Error adding review', error: error.message });
  }
};

const addRequest = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  const { details } = req.body;
  try {
    if (listingId) {
      const existingRequest = await Request.findOne({
        userId,
        listingId,
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: 'You have already sent a request to this listing' });
      }
      const request = await Request.create({
        userId,
        listingId,
        details,
      });
      return res.status(201).json({ request });
    } else {
      const request = await Request.create({
        userId,
        details,
      });
      return res.status(201).json({ request });
    }
  } catch (error) {
    console.error('Error sending request', error);
    res
      .status(500)
      .json({ message: 'Error sending request', error: error.message });
  }
};

const removeRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    await Request.deleteOne({ _id: requestId });
    res.json({ message: 'Request removed successfully' });
  } catch (error) {
    console.error('Error removing request', error);
    res
      .status(500)
      .json({ message: 'Error removing request', error: error.message });
  }
};

const getRequests = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const userId = req.userId;
  try {
    console.log('query', query);
    let queryObj;
    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    switch (query) {
      case 'my-posts':
        queryObj = { userId };
        break;
      case 'most-recent':
        queryObj = { city: client.preferences.city };
        break;
      case 'best-matches':
        queryObj = {
          city: client.preferences.city,
          budget: {
            $gte: client.preferences.budget - 400,
            $lte: client.preferences.budget + 400,
          },
        };
        break;
      case 'saved-posts':
        queryObj = { _id: { $in: client.savedPosts } };
        break;
      default:
        queryObj = {};
    }

    const requests = await Request.find(queryObj)
      .populate('userId', { hash: 0, refreshTokens: 0 })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalPages = Math.ceil(
      (await Request.countDocuments(queryObj)) / parseInt(limit)
    );
    return res.json({ requests, totalPages });
  } catch (error) {
    console.error('Error getting requests', error);
    res
      .status(500)
      .json({ message: 'Error getting requests', error: error.message });
  }
};

const updatePreferences = async (req, res) => {
  const userId = req.userId;
  const { preferences } = req.body;
  try {
    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.preferences = {
      budget: preferences.budget || client.preferences.budget,
      city: preferences.city || client.preferences.city,
      school: preferences.school || client.preferences.school,
    };

    await client.save();
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences', error);
    res
      .status(500)
      .json({ message: 'Error updating preferences', error: error.message });
  }
};

const getClientData = async (req, res) => {
  const userId = req.userId;
  try {
    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ client });
  } catch (error) {
    console.error('Error getting client data', error);
    res
      .status(500)
      .json({ message: 'Error getting client data', error: error.message });
  }
};

module.exports = {
  getListings,
  getListing,
  updatePreferences,
  addLike,
  removeLike,
  addReview,
  addRequest,
  removeRequest,
  getRequests,
  getClientData,
};
