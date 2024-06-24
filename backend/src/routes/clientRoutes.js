const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getListings,
  updatePreferences,
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
router.patch('/profile/preferences', updatePreferences);
router.get('/listings', getListings);

module.exports = router;
