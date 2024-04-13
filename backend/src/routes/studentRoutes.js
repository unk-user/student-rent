const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {getListings, getListing, bookmarkListing, removeListingBookmark, bookListing, cancelBooking} = require('../controllers/studentController');
const router = express.Router();

router.use(verifyToken);

router.get('/listings', getListings);
router.get('/listings/:id', getListing);

router.post('/listings/bookmark/:id', bookmarkListing);
router.delete('/listings/bookmark/:id', removeListingBookmark);

router.post('/listings/book/:id', bookListing);
router.delete('/listings/book/:id', cancelBooking);

module.exports = router;
