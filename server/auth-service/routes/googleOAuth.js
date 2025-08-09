const express = require('express');
const router = express.Router();
const generateToken = require('../utils/jwt');
const passport = require('passport');


router.get('/google', (req, res) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
});

router.get('/google/callback', 
  passport.authenticate('google', { session: false }), (req, res) => {
    // user object is now { id, email, provider, name, googleId }
    const user = req.user;
    // Defensive: if user is wrapped in { user: ... }
    const userData = user && user.id ? user : (user && user.user ? user.user : null);
    if (!userData) {
      return res.redirect('http://localhost:3000/login?error=google_auth_failed');
    }
    const token = generateToken(userData);
    res.redirect(`http://localhost:3000/google/callback?token=${token}`);
  }
);

module.exports = router;