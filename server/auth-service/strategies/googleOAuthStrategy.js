const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
require("dotenv").config();

// Get user service URL from environment or use default
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log(`Google OAuth attempt for email: ${profile.emails?.[0]?.value || 'No email'}`);
        
        // Validate profile data
        if (!profile.id || !profile.emails || !profile.emails[0]) {
          return done(new Error('Incomplete Google profile data'), null);
        }

        // Try to find user in user-service
        const findResponse = await axios.post(
          `${USER_SERVICE_URL}/api/user/google/find`,
          { googleId: profile.id },
          { timeout: 10000 }
        );
        
        let user = findResponse.data?.user || null;
        
        if (!user) {
          console.log(`Creating new Google user: ${profile.emails[0].value}`);
          
          // Create user in user-service
          const createResponse = await axios.post(
            `${USER_SERVICE_URL}/api/user/google/create`,
            {
              googleId: profile.id,
              name: profile.displayName || 'Google User',
              email: profile.emails[0].value,
              provider: "google",
            },
            { timeout: 10000 }
          );
          
          user = createResponse.data?.user || null;
          
          if (!user) {
            return done(new Error('Failed to create Google user'), null);
          }
          
          console.log(`Successfully created Google user: ${user.email}`);
        } else {
          console.log(`Found existing Google user: ${user.email}`);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth strategy error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
          return done(new Error('User service unavailable'), null);
        }
        
        if (error.code === 'ECONNABORTED') {
          return done(new Error('User service timeout'), null);
        }
        
        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data?.error || 'User service error';
          return done(new Error(`User service error (${status}): ${errorMessage}`), null);
        }
        
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/api/user/find`,
      { id },
      { timeout: 5000 }
    );
    done(null, response.data?.user || null);
  } catch (error) {
    console.error('Deserialize user error:', error.message);
    done(error, null);
  }
});
