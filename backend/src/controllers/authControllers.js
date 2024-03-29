const bcrypt = require('bcrypt');
const { generateToken, hashPassword } = require('../helpers/authHelpers');
const User = require('../models/User.model');
const Client = require('../models/Client.model');
const Landlord = require('../models/Landlord.model');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      res.status(401).json({ message: 'wrong password' });
    }
    const token = generateToken(user._id, user.role);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ message: 'Login successfull', token });
  } catch (error) {
    console.error('login error:', error);
  }
};

const registerUser = async (req, res) => {
  console.log(req.body)
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      hash,
      role,
    });

    await newUser.save();
    if (role === 'landlord') {
      const newLandlord = new Landlord({
        userId: newUser._id,
        properties: [],
      });

      await newLandlord.save();
    } else if (role === 'client') {
      const { school, age } = req.body;
      const newClient = new Client({
        userId: newUser._id,
        school,
        age,
      });

      await newClient.save();
    }
    const token = generateToken(newUser._id, newUser.role);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
