const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  getListing,
  updatePreferences,
  addLike,
  addReview,
  removeLike,
  addRequest,
  removeRequest,
} = require('../controllers/clientControllers/clientControllers');
const {
  loginClient,
  registerClient,
} = require('../controllers/clientControllers/clientAuthControllers');
const upload = require('../middleware/multer');
const router = express.Router();

router.use('/register', upload.single('image'), registerClient);
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
router.post('/listings/:listingId/request', addRequest);
router.delete('/listings/:listingId/request', removeRequest);

router.patch('/profile/preferences', updatePreferences);

module.exports = router;
