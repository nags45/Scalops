const express = require("express");
const router = express.Router();
const generateToken = require("../utils/jwt");
const axios = require("axios");

// Get user service URL from environment or use default
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: "Email and password must be strings" });
  }
  
  if (email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: "Email and password cannot be empty" });
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  next();
};

const validateRegisterInput = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }
  
  if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ error: "All fields must be strings" });
  }
  
  if (email.trim() === '' || password.trim() === '' || name.trim() === '') {
    return res.status(400).json({ error: "All fields cannot be empty" });
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }
  
  next();
};

router.post("/login", validateLoginInput, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // User-service should validate credentials and return user if valid
    const response = await axios.post(
      `${USER_SERVICE_URL}/api/user/validate`,
      { email, password },
      { timeout: 10000 } // 10 second timeout
    );
    
    const user = response.data.user;
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const token = generateToken(user);
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: "User service unavailable" });
    }
    
    if (error.response) {
      // User service returned an error
      return res.status(error.response.status).json({ 
        error: error.response.data?.error || "Invalid email or password" 
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: "Request timeout" });
    }
    
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", validateRegisterInput, async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    // Check if user already exists
    const findResponse = await axios.post(
      `${USER_SERVICE_URL}/api/user/find`,
      { email },
      { timeout: 10000 }
    );
    
    const existingUser = findResponse.data.user;
    if (existingUser) {
      if (existingUser.provider === "local") {
        return res.status(409).json({ error: "User already exists" });
      } else {
        return res.status(409).json({
          error: `User already exists. Please sign in with ${existingUser.provider}.`,
        });
      }
    }
    
    // Create user via user-service
    const createResponse = await axios.post(
      `${USER_SERVICE_URL}/api/user/create`,
      { email, password, provider: "local", name },
      { timeout: 10000 }
    );
    
    const user = createResponse.data.user;
    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }
    
    const token = generateToken(user);
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: "User service unavailable" });
    }
    
    if (error.response) {
      // User service returned an error
      return res.status(error.response.status).json({ 
        error: error.response.data?.error || "Registration failed" 
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: "Request timeout" });
    }
    
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
