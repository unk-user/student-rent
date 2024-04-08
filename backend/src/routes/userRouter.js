const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.use(verifyToken);

router.get('/', (req, res) => {
  res.json({
    id: req.userId,
    role: req.role,
  })
})


module.exports = router;