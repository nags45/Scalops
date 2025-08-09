const express = require('express');
const cors = require('cors');
const passport = require('passport');
const sequelize = require('./db/sequelize');
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/userRoute');
require('dotenv').config();
require('./auth/gauth');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
}).catch((err) => {
  console.error('Failed to connect to PostgreSQL:', err);
});