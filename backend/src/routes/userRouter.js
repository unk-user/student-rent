const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User.model');
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/multer');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.use(verifyToken);

router.get('/', async (req, res) => {
  const userId = req.userId;
  const role = req.role;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.sendStatus(403);
    }

    return res.status(200).json({
      user,
      role,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.patch('/edit', upload.single('file'), async (req, res) => {
  const userId = req.userId;
  const { username, firstName, lastName, deletePreviousImage } = req.body;
  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.sendStatus(403);
    }

    if (deletePreviousImage == 'true' && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id, {
        invalidate: true,
      });
      user.profilePicture = null;
    }

    if (req.file) {
      const profilePicture = {
        url: req.file.path,
        public_id: req.file.filename,
      };
      console.log('or here');
      user.profilePicture = profilePicture;
    }

    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
