const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landlordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  properties: [{ type: Schema.Types.ObjectId, ref: 'RentalListing' }],
});

module.exports = mongoose.model('Landlord', landlordSchema);