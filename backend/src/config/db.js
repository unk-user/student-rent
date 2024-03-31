const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDb connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`Error connecting to MongoDb: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;