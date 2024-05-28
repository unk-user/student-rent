const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  createListing,
  getListing,
  updateListing,
  addStudent,
  deleteStudent,
  deleteListing,
} = require('../controllers/landlordControllers');
const router = express.Router();

router.use(verifyToken);
router.get('/listings', getListings);
router.post('/listings', createListing);

router.get('/listings/:listingId', getListing);
router.put('/listings/:listingId', updateListing);
router.delete('/listings/:listingId', deleteListing);

router.post('/listings/:listingId/students', addStudent);
router.delete('/listings/:listingId/students', deleteStudent);

module.exports = router;
