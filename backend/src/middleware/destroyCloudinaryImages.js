const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const destroyCloudinaryImages = async (req, res, next) => {
  if (req.body.removeImages) {
    const publicIds = req.body.removeImages;
    try {
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
      console.log('Cloudinary images destroyed');
    } catch (error) {
      console.error('Failed to destroy Cloudinary images:', error);
      return res
        .status(500)
        .json({ error: 'Failed to destroy Cloudinary images' });
    }
  }
  next();
};

module.exports = destroyCloudinaryImages;
