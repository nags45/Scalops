const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

// Environment variable validation
const requiredEnvVars = ['JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const CORS_ORIGINS = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : 
  ['http://localhost:3000'];

const localAuthRoutes = require("./routes/localAuth");
const googleAuthRoutes = require("./routes/googleOAuth");
const jwtAuthRoutes = require("./routes/jwtAuth");
const connectAWS = require("./routes/connectAWS");
require("./strategies/googleOAuthStrategy");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (CORS_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Security middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Passport initialization
app.use(passport.initialize());

// Health check route
app.get("/api/auth/health", (req, res) => {
  res.json({ 
    status: "Auth service running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API routes
app.use("/api/auth", localAuthRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/auth", jwtAuthRoutes);
app.use("/api/auth", connectAWS);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on http://localhost:${PORT}`);
  console.log(`📡 CORS origins: ${CORS_ORIGINS.join(', ')}`);
  console.log(`🔗 User service URL: ${USER_SERVICE_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
