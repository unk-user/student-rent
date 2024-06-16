const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  createListing,
  getListing,
  addStudent,
  deleteStudent,
} = require('../controllers/landlordControllers');
const updateListing = require('../controllers/updateListingController');
const deleteListing = require('../controllers/deleteListingController');
const router = express.Router();

router.use(verifyToken);
router.get('/listings', getListings);
router.post('/listings', createListing);

router.get('/listings/:listingId', getListing);
router.put('/listings/:listingId', updateListing);
router.delete('/listings/:listingId', deleteListing);

module.exports = router;
