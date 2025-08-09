const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/jwtAuth');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const User = require('../models/user');
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider
    }});
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;