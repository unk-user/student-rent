const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const verifyToken = require('../middleware/verifyToken');
const destroyCloudinaryImages = require('../middleware/destroyCloudinaryImages');

router.use(verifyToken);
router.use(destroyCloudinaryImages);
router.post('/', upload.array('files', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }
    const results = req.files.map((file) => ({
      public_id: file.filename,
      secure_url: file.path,
    }));
    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

router.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;
