const express = require('express');
const cors = require('cors');
const sequelize = require('./db/sequelize');
const userController = require('./routes/userController');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/api/user', userController);

app.use('/api/user', userRoutes);

app.get('/api/user/health', (req, res) => {
  res.json({ status: 'User service running' });
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to PostgreSQL:', err);
});