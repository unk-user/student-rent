const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  getListing,
  updatePreferences,
  addLike,
  addReview,
  removeLike,
} = require('../controllers/clientControllers/clientControllers');
const {
  loginClient,
  registerClient,
} = require('../controllers/clientControllers/clientAuthControllers');
const router = express.Router();

router.use('/register', registerClient);
router.use('/login', loginClient);

router.use(verifyToken);
router.use((req, res, next) => {
  if (req.role !== 'client') {
    return res.sendStatus(403);
  }
  next();
});

router.get('/listings', getListings);
router.get('/listings/:listingId', getListing);
router.post('/listings/:listingId/like', addLike);
router.delete('/listings/:listingId/like', removeLike);
router.post('/listings/:listingId/review', addReview);

router.patch('/profile/preferences', updatePreferences);

module.exports = router;
