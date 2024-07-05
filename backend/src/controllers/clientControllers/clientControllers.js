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
    limit = 16,
    sortBy = 'relevance',
    minPrice,
    maxPrice,
    location,
    rentPeriod,
    category,
  } = req.query;
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const currentClient = await Client.findOne({ userId });

    const similarClients = await Client.find({
      'preferences.budget': {
        $gte: currentClient.preferences.budget * 0.8,
        $lte: currentClient.preferences.budget * 1.2,
      },
      userId: { $ne: userId },
    }).limit(10);

    const similarClientIds = similarClients.map((client) => client.userId);

    let query = [];

    if (minPrice || maxPrice || location || rentPeriod) {
      const match = {};

      if (minPrice) match['details.price'] = { $gte: parseInt(minPrice) };
      if (maxPrice)
        match['details.price'] = {
          ...match['details.price'],
          $lte: parseInt(maxPrice),
        };
      if (location) match['details.location'] = location;
      if (rentPeriod) match['details.period'] = rentPeriod;
      if (category) match['details.category'] = category;

      console.log(match);

      query.push({
        $match: match,
      });
    }

    query.push({
      $lookup: {
        from: 'rentallistinglikes',
        localField: '_id',
        foreignField: 'rentalListingId',
        as: 'likes',
      },
    });

    query.push({
      $lookup: {
        from: 'rentallistingviews',
        localField: '_id',
        foreignField: 'rentalListingId',
        as: 'views',
      },
    });

    query.push({
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'rentalListingId',
        as: 'reviews',
      },
    });

    query.push({
      $addFields: {
        interactionScore: {
          $add: [
            {
              $size: {
                $setIntersection: ['$views.userId', similarClientIds],
              },
            },
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: ['$likes.userId', similarClientIds],
                  },
                },
                2,
              ],
            },
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: ['$reviews.userId', similarClientIds],
                  },
                },
                5,
              ],
            },
            {
              $cond: [
                { $eq: ['$details.city', currentClient.preferences.city] },
                1000,
                0,
              ],
            },
          ],
        },
      },
    });

    if (sortBy === 'relevance') {
      query.push({
        $sort: {
          'interactionSummary.reviewAvg': -1,
          interactionScore: -1,
        },
      });
    } else if (['newest', 'oldest'].includes(sortBy)) {
      query.push({
        $sort: {
          createdAt: sortBy === 'newest' ? -1 : 1,
        },
      });
    } else if (['cheapest', 'expensive'].includes(sortBy)) {
      query.push({
        $sort: {
          'details.price': sortBy === 'cheapest' ? 1 : -1,
        },
      });
    }

    query.push({
      $skip: skip,
    });
    query.push({
      $limit: parseInt(limit),
    });

    const listings = await RentalListing.aggregate(query);

    const total = await RentalListing.countDocuments({ ...query[0].$match });

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
          from: 'rentalListingLikes',
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
    res.json({ message: 'Like added successfully' });
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
    res.json({ message: 'Like removed successfully' });
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
    const existingRequest = await Request.findOne({
      userId,
      listingId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'You have already sent a request to this listing' });
    }
    const request = new Request({
      userId,
      listingId,
      details,
    });
    await request.save();
    res.json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Error sending request', error);
    res
      .status(500)
      .json({ message: 'Error sending request', error: error.message });
  }
};

const removeRequest = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  try {
    await Request.deleteOne({ userId, listingId });
    res.json({ message: 'Request removed successfully' });
  } catch (error) {
    console.error('Error removing request', error);
    res
      .status(500)
      .json({ message: 'Error removing request', error: error.message });
  }
};

const likeRequest = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.userId;
  try {
    const request = await Request.findOne({ listingId });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.likes.includes(userId)) {
      await request.updateOne({
        $pull: { likes: userId },
        $inc: { likesCount: -1 },
      });
      return res.status(204).json({ message: 'Request unliked successfully' });
    } else {
      await request.updateOne({
        $push: { likes: userId },
        $inc: { likesCount: 1 },
      });
      return res.status(200).json({ message: 'Request liked successfully' });
    }
  } catch (error) {
    console.error('Error liking request', error);
    res
      .status(500)
      .json({ message: 'Error liking request', error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error getting requests', error);
    res
      .status(500)
      .json({ message: 'Error getting requests', error: error.message });
  }
};

const updatePreferences = async (req, res) => {
  const userId = req.userId;
  const { budget, city, school } = req.body;
  try {
    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.preferences = {
      budget: budget || client.preferences.budget,
      city: city || client.preferences.city,
      school: school || client.preferences.school,
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

module.exports = {
  getListings,
  getListing,
  updatePreferences,
  addLike,
  removeLike,
  addReview,
  addRequest,
  removeRequest,
  likeRequest,
  getRequests,
};
