const express = require('express');
const router = express.Router();
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const passport = require('passport');


router.get('/google', (req, res) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
});

router.get('/google/callback', 
  passport.authenticate('google', { session: false }), (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res.redirect(`http://localhost:3000/google/callback?token=${token}`);
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, provider: 'local' } });
  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }
  const valid = await user.validatePassword(password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = generateToken(user);
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    if (existingUser.provider === 'local') {
      return res.status(409).json({ error: 'User already exists' });
    } else {
      return res.status(409).json({ error: `User already exists. Please sign in with ${existingUser.provider}.` });
    }
  }
  const user = await User.create({ email, password, provider: 'local', name });
  const token = generateToken(user);
  res.status(201).json({ token });
});

module.exports = router;
