const express = require('express');
const City = require('../models/City.model');
const {
  getCity,
  getCities,
  postCity,
  postInstitution,
} = require('../controllers/cityDataControllers');
const router = express.Router();

router.get('/', getCities);
router.post('/', postCity);

router.get('/:id', getCity);
router.post('/:id', postInstitution);

module.exports = router;
