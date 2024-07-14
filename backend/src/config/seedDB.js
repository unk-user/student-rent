const mongoose = require('mongoose');
const { fakerFR: faker } = require('@faker-js/faker');

// Import your models
const User = require('../models/User.model');
const Client = require('../models/Client.model');
const Landlord = require('../models/Landlord.model');
const RentalListing = require('../models/RentalListing.model');
const Request = require('../models/Request.model');
const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');
const RentalListingLike = require('../models/RentalListingLike.model');
const RentalListingView = require('../models/RentalListingView.model');
const Review = require('../models/Review.model');

const citiesArray = [
  'Agadir',
  'Al Hoceima',
  'Azrou',
  'Beni Mellal',
  'Boujdour',
  'Casablanca',
  'Chefchaouen',
];

const schoolsArray = ['ensa', 'ens', 'esef'];

const images = [
  {
    public_id: 'student-rent/h3zhfwhfakceywamyzaf',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1719236867/student-rent/h3zhfwhfakceywamyzaf.webp',
  },
  {
    public_id: 'student-rent/oqrtthg9t1bggwqn5h9j',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1719236929/student-rent/oqrtthg9t1bggwqn5h9j.webp',
  },
  {
    public_id: 'student-rent/pvgkqyunjkqrclassbt6',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1719236929/student-rent/pvgkqyunjkqrclassbt6.webp',
  },
  {
    public_id: 'student-rent/vxbyvvwfv8miyayqfbe7',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1719236929/student-rent/vxbyvvwfv8miyayqfbe7.webp',
  },
  {
    public_id: 'student-rent/tapks0hjo1hfusvmd9xl',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1719236929/student-rent/tapks0hjo1hfusvmd9xl.webp',
  },
  {
    public_id: 'student-rent/ois7fajlncfemm436ncy',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963587/student-rent/ois7fajlncfemm436ncy.jpg',
  },
  {
    public_id: 'student-rent/mvyh2yjrrrqopovobli3',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/mvyh2yjrrrqopovobli3.jpg',
  },
  {
    public_id: 'student-rent/yilly7wst4acvmbcsn4x',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/yilly7wst4acvmbcsn4x.jpg',
  },
  {
    public_id: 'student-rent/yv1vrqsibtodppfpxoqf',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/yv1vrqsibtodppfpxoqf.jpg',
  },
  {
    public_id: 'student-rent/fgvwohyao9najdn6ddre',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/fgvwohyao9najdn6ddre.jpg',
  },
  {
    public_id: 'student-rent/g9ax2lghuvgdlnrsfkv6',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/g9ax2lghuvgdlnrsfkv6.jpg',
  },
  {
    public_id: 'student-rent/q9ryye76trsszgytotyq',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/q9ryye76trsszgytotyq.jpg',
  },
  {
    public_id: 'student-rent/dmapsemknzoheusku8ch',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963586/student-rent/dmapsemknzoheusku8ch.jpg',
  },
  {
    public_id: 'student-rent/vxzaldujg0zpcf7rnjqz',
    url: 'https://res.cloudinary.com/ds9dvbxys/image/upload/v1720963585/student-rent/vxzaldujg0zpcf7rnjqz.jpg',
  },
];

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
  console.log('Connected to MongoDB');

  // Helper function to create a user
  const createUser = async (role) => {
    const user = new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      hash: faker.internet.password(),
      role,
    });
    return user.save();
  };

  // Create Clients and Landlords
  const users = [];
  for (let i = 0; i < 10; i++) {
    const client = await createUser('client');
    const landlord = await createUser('landlord');
    users.push({ client, landlord });
  }

  // Create Clients
  const clients = users.map(async ({ client }) => {
    const newClient = new Client({
      userId: client._id,
      preferences: {
        city: citiesArray[
          faker.number.int({ min: 0, max: citiesArray.length - 1 })
        ],
        school:
          schoolsArray[
            faker.number.int({ min: 0, max: schoolsArray.length - 1 })
          ],
        budget: faker.number.int({ min: 200, max: 2000 }),
      },
      savedPosts: [],
      savedListings: [],
    });
    return newClient.save();
  });

  // Create Landlords
  const landlords = users.map(async ({ landlord }) => {
    const newLandlord = new Landlord({
      userId: landlord._id,
      properties: [],
    });
    return newLandlord.save();
  });

  // Create Rental Listings
  const rentalListings = [];
  for (let i = 0; i < 10; i++) {
    const randomLandlord = await landlords[
      faker.number.int({ min: 0, max: 9 })
    ];

    for (let j = 0; j < 20; j++) {
      const rentalListing = new RentalListing({
        landlordId: randomLandlord._id,
        userId: randomLandlord.userId,
        details: {
          title: faker.lorem.words(),
          about: faker.lorem.paragraph(),
          location: faker.location.streetAddress(),
          city: citiesArray[
            faker.number.int({ min: 0, max: citiesArray.length - 1 })
          ],
          period: 'monthly',
          price: faker.number.int({ min: 1000, max: 5000 }),
          rooms: faker.number.int({ min: 1, max: 5 }),
          bathrooms: faker.number.int({ min: 1, max: 3 }),
          area: faker.number.int({ min: 30, max: 100 }),
          category: ['apartment', 'studio'][
            faker.number.int({ min: 0, max: 1 })
          ],
          images: [
            images[faker.number.int({ min: 0, max: images.length - 1 })],
            images[faker.number.int({ min: 0, max: images.length - 1 })],
            images[faker.number.int({ min: 0, max: images.length - 1 })],
          ],
        },
        status: 'active',
        interactionSummary: {
          viewCount: 0,
          likeCount: 0,
          reviewAvg: 0,
          reviewCount: 0,
        },
        requests: [],
      });
      const savedListing = await rentalListing.save();
      rentalListings.push(savedListing);
    }
  }

  // Create Requests
  const requests = [];
  for (let i = 0; i < 400; i++) {
    const randomListing = rentalListings[faker.number.int({ min: 0, max: 199 })];
    const randomClient = await clients[faker.number.int({ min: 0, max: 9 })];

    const request = new Request({
      listingId: randomListing._id,
      userId: randomClient.userId,
      status: ['pending', 'accepted'][faker.number.int({ min: 0, max: 1 })],
      details: {
        numberOfRoommatesTotal: faker.number.int({ min: 1, max: 5 }),
        numberOfRoommatesApplied: faker.number.int({ min: 1, max: 5 }),
        preferences: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.lorem.word()
        ),
        message: faker.lorem.sentence(),
      },
      city: randomListing.details.city,
      budget: randomListing.details.price,
    });
    const savedRequest = await request.save();
    requests.push(savedRequest);
  }

  // Create Conversations
  const conversations = [];
  for (let i = 0; i < 10; i++) {
    const participants = [
      users[faker.number.int({ min: 0, max: 9 })].client,
      users[faker.number.int({ min: 0, max: 9 })].landlord,
    ];

    const conversation = new Conversation({
      participants: participants.map((p) => p._id),
      lastMessage: {
        sender: participants[0]._id,
        content: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
      },
    });
    const savedConversation = await conversation.save();
    conversations.push(savedConversation);
  }

  // Create Messages
  for (let i = 0; i < 20; i++) {
    const randomConversation =
      conversations[faker.number.int({ min: 0, max: 9 })];
    const randomUser = users[faker.number.int({ min: 0, max: 9 })].client;

    const message = new Message({
      conversationId: randomConversation._id,
      sender: randomUser._id,
      content: faker.lorem.sentence(),
      readBy: [randomUser._id],
      createdAt: faker.date.recent(),
    });
    await message.save();
  }

  // Create Rental Listing Likes
  for (let i = 0; i < 100; i++) {
    const randomListing = rentalListings[faker.number.int({ min: 0, max: 199 })];
    const randomClient = await clients[faker.number.int({ min: 0, max: 9 })];

    const rentalListingLike = new RentalListingLike({
      rentalListingId: randomListing._id,
      userId: randomClient.userId,
    });
    await rentalListingLike.save();
  }

  // Create Rental Listing Views
  for (let i = 0; i < 100; i++) {
    const randomListing = rentalListings[faker.number.int({ min: 0, max: 199 })];
    const randomClient = await clients[faker.number.int({ min: 0, max: 9 })];

    const rentalListingView = new RentalListingView({
      rentalListingId: randomListing._id,
      userId: randomClient.userId,
    });
    await rentalListingView.save();
  }

  // Create Reviews
  for (let i = 0; i < 800; i++) {
    const randomListing = rentalListings[faker.number.int({ min: 0, max: 199 })];
    const randomClient = await clients[faker.number.int({ min: 0, max: 9 })];

    const review = new Review({
      userId: randomClient.userId,
      rentalListingId: randomListing._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
    });
    await review.save();
  }

  mongoose.connection.close();
  console.log('Database seeded successfully');
});
