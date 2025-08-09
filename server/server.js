const express = require('express');
const cors = require('cors');
const authenticateJWT = require('./middleware/jwtAuth');
const passport = require('passport');
const path = require('path');
const app = express();
require('dotenv').config();
const sequelize = require('./db/sequelize');
require('./auth/gauth');
const authRoutes = require('./routers/auth');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);


app.get('/api/user', authenticateJWT, async (req, res) => {
  try {
    const User = require('./models/user');
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


sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
}).catch((err) => {
  console.error('Failed to connect to PostgreSQL:', err);
});