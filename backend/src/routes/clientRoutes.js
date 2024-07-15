const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const clientControllers = require('../controllers/clientControllers/clientControllers');
const {
  loginClient,
  registerClient,
} = require('../controllers/clientControllers/clientAuthControllers');
const upload = require('../middleware/multer');
const router = express.Router();

router.use('/register', upload.single('image'), registerClient);
router.use('/login', loginClient);
router.get('/listings/random', clientControllers.getRandomListings);

router.use(verifyToken);
router.use((req, res, next) => {
  if (req.role !== 'client') {
    return res.sendStatus(403);
  }
  next();
});

router.get('/listings', clientControllers.getListings);
router.get('/listings/:listingId', clientControllers.getListing);
router.post('/listings/:listingId/like', clientControllers.addLike);
router.delete('/listings/:listingId/like', clientControllers.removeLike);
router.post('/listings/:listingId/review', clientControllers.addReview);
router.get('/requests', clientControllers.getRequests);
router.post('/requests/:listingId', clientControllers.addRequest);
router.post('/requests/', clientControllers.addRequest);
router.delete('/requests/:requestId', clientControllers.removeRequest);

router.get('/profile', clientControllers.getClientData);
router.patch('/profile/preferences', clientControllers.updatePreferences);

module.exports = router;
