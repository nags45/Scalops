const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/jwtAuth');

router.get('/', authenticateJWT, (req, res) => {
  res.json({ success: true, userId: req.user.id });
});

module.exports = router;