const City = require('../models/City.model');

const getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ city: 1 });
    if (!cities) {
      return res.json({ message: 'Data connot be retrieved' });
    }
    res.json({ cities });
  } catch (error) {
    console.error('Error trying to fetch cities Data:', error);
    res.json({ message: 'error' });
  }
};

const getCity = async (req, res) => {
  const id = req.params.id;
  try {
    const city = await City.findOne({ _id: id });
    if (!city) {
      return res.json({ message: 'city not found' });
    }
    res.json({ city });
  } catch (error) {
    console.error('error fetching city:', error);
  }
};

const postCity = async (req, res) => {
  const { city, institutions } = req.body;
  if(!city) {
   return res.json({ message: 'enter city name' })
  }
  try {
    const definedCity = await City.findOne({ city });
    if (definedCity) {
      return res.json({ message: 'city already defined', definedCity });
    }
    const newCity = new City({ city: city, institutions });
    await newCity.save();
    res.status(201).json({ message: 'city added', newCity });
  } catch (error) {
    console.error('error posting city:', error);
  }
};

const postInstitution = async (req, res) => {
  const { name } = req.body;
  const cityId = req.params.id;
  try {
    const city = await City.findOne({ _id: cityId });
    if (!city) {
      return res.json({ message: 'city not found' });
    }
    const newInstitu = { name };

    city.institutions.push(newInstitu);

    await city.save();
  } catch (error) {
    console.error('Error adding institution to city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCities,
  getCity,
  postCity,
  postInstitution,
};
