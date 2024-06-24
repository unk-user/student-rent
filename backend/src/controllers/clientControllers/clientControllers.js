const RentalListing = require('../../models/RentalListing.model');
const Client = require('../../models/Client.model');

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

    const similarClientIds = similarClients.map((client) => client._id);

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
        from: 'rentalListingLikes',
        localField: '_id',
        foreignField: 'rentalListingId',
        as: 'likes',
      },
    });

    query.push({
      $lookup: {
        from: 'rentalListingViews',
        localField: '_id',
        foreignField: 'rentalListingId',
        as: 'views',
      },
    });

    query.push({
      $addFields: {
        intersectionScore: {
          $add: [
            {
              $size: {
                $setIntersection: ['$views', similarClientIds],
              },
            },
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: ['$likes', similarClientIds],
                  },
                },
                2,
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
          averageRating: -1,
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

module.exports = { getListings, updatePreferences };
