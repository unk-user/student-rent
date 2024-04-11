const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { getListings, createListing } = require('../controllers/landlordControllers');
const router = express.Router();

router.use(verifyToken);
router.get('/listings', getListings);
router.post('/listings', createListing);

module.exports = router;