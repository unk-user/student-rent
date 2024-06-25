const RentalListing = require('../../models/RentalListing.model');
const Client = require('../../models/Client.model');
const RentalListingLike = require('../../models/RentalListingLike.model');
const RentalListingView = require('../../models/RentalListingView.model');
const Review = require('../../models/Review.model');

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
  } = req.query;
  try {
    const skip = (page - 1) * limit;

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
      const match = {
        'details.price': {},
        'details.location': {},
        'details.period': {},
      };
      if (minPrice) match['details.price'].$gte = minPrice;
      if (maxPrice) match['details.price'].$lte = maxPrice;
      if (location) match['details.location'] = location;
      if (rentPeriod) match['details.period'] = rentPeriod;

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
      currentPage: page,
      totalPages: Math.ceil(total / limit),
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
    const listing = await RentalListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!req.cookies[`viewed_${listingId}`]) {
      const view = new RentalListingView({
        rentalListingId: listingId,
        userId: req.userId,
      });
      await view.save();
      res.cookie(`viewed_${listingId}`, true, { maxAge: 24 * 60 * 60 * 1000 });
    }
    const reviews = await Review.find({ rentalListingId: listingId });

    res.json({ listing, reviews });
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
  addReview,
};
