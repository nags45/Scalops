const express = require('express');
const router = express.Router();
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

module.exports = router;