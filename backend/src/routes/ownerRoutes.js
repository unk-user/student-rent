const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  createListing,
} = require('../controllers/ownerControllers/ownerControllers');
const {
  loginOwner,
  registerOwner,
} = require('../controllers/ownerControllers/ownerAuthControllers');
const upload = require('../middleware/multer');
const router = express.Router();

router.use('/register', registerOwner);
router.use('/login', loginOwner);

router.use(verifyToken);
router.use((req, res, next) => {
  if (req.role !== 'landlord') {
    return res.sendStatus(403);
  }
  next();
});
router.post('/listings', upload.array('images', 5), createListing);

module.exports = router;
