const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
  name: { type: String, required: true },
});

const citySchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  institutions: [institutionSchema],
});

const City = mongoose.model('City', citySchema);

module.exports = City;
