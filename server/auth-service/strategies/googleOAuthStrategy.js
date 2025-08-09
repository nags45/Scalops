const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Try to find user in user-service
      const findResponse = await axios.post('http://localhost:5001/api/user/google/find', {
        googleId: profile.id
      });
      let user = findResponse.data;
      if (!user) {
        // Create user in user-service
        const createResponse = await axios.post('http://localhost:5001/api/user/google/create', {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
          provider: 'google'
        });
        user = createResponse.data;
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));