const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student-rent',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    format: 'webp',
    transformation: {
      width: 800,
      height: 600,
      crop: 'limit',
    },
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter called');
    console.log('File:', file);
    cb(null, true); // Accept file
  },
});

module.exports = upload;
