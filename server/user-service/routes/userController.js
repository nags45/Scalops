const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Input validation middleware
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ error: "Valid email is required" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  req.body.email = email.trim().toLowerCase();
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: "Password is required" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }
  
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: "Valid name is required" });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters long" });
  }
  
  req.body.name = name.trim();
  next();
};

// Find user by email
router.post("/find", validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      // Exclude sensitive information
      const { password, accessKeyId, secretAccessKey, ...safeUser } = user.toJSON();
      return res.json({ user: safeUser });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    console.error('Find user error:', error);
    res.status(500).json({ error: "Failed to find user" });
  }
});

// Create user
router.post("/create", [validateEmail, validatePassword, validateName], async (req, res) => {
  try {
    const { email, password, provider, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    
    const user = await User.create({ email, password, provider, name });
    
    if (user) {
      // Exclude sensitive information
      const { password: _, accessKeyId: __, secretAccessKey: ___, ...safeUser } = user.toJSON();
      return res.status(201).json({ user: safeUser });
    } else {
      return res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Invalid user data" });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Validate credentials
router.post("/validate", [validateEmail, validatePassword], async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email, provider: "local" } });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Exclude sensitive information
    const { password: _, accessKeyId: __, secretAccessKey: ___, ...safeUser } = user.toJSON();
    return res.json({ user: safeUser });
  } catch (error) {
    console.error('Validate credentials error:', error);
    res.status(500).json({ error: "Failed to validate credentials" });
  }
});

// Link accounts
router.post("/link", async (req, res) => {
  try {
    const { userId, accessKeyId, secretAccessKey } = req.body;
    
    // Validate required fields
    if (!userId || !accessKeyId || !secretAccessKey) {
      return res.status(400).json({
        error: "User ID, Access Key ID, and Secret Access Key are required"
      });
    }
    
    // Validate AWS credentials are not empty
    if (
      accessKeyId.trim() === "" ||
      secretAccessKey.trim() === ""
    ) {
      return res.status(400).json({
        error: "AWS Access Key ID and Secret Access Key must not be empty"
      });
    }
    
    // Validate userId is a number
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.accessKeyId = accessKeyId.trim();
    user.secretAccessKey = secretAccessKey.trim();
    await user.save();
    
    res.json({
      success: true,
      message: "AWS account linked successfully"
    });
  } catch (error) {
    console.error('Link account error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Invalid AWS credentials" });
    }
    
    res.status(500).json({ error: "Failed to link account" });
  }
});

// Google user lookup
router.post("/google/find", async (req, res) => {
  try {
    const { googleId } = req.body;
    
    if (!googleId || typeof googleId !== 'string' || googleId.trim() === '') {
      return res.status(400).json({ error: "Valid Google ID is required" });
    }
    
    const user = await User.findOne({ where: { googleId } });
    
    if (user) {
      // Exclude sensitive information
      const { password, accessKeyId, secretAccessKey, ...safeUser } = user.toJSON();
      return res.json({ user: safeUser });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    console.error('Google user lookup error:', error);
    res.status(500).json({ error: "Failed to lookup Google user" });
  }
});

// Google user creation
router.post("/google/create", [validateEmail, validateName], async (req, res) => {
  try {
    const { googleId, name, email, provider } = req.body;
    
    if (!googleId || typeof googleId !== 'string' || googleId.trim() === '') {
      return res.status(400).json({ error: "Valid Google ID is required" });
    }
    
    if (provider !== 'google') {
      return res.status(400).json({ error: "Provider must be 'google'" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ email }, { googleId }] 
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    
    const user = await User.create({ googleId, name, email, provider });
    
    if (user) {
      // Exclude sensitive information
      const { password: _, accessKeyId: __, secretAccessKey: ___, ...safeUser } = user.toJSON();
      return res.status(201).json({ user: safeUser });
    } else {
      return res.status(500).json({ error: "Failed to create Google user" });
    }
  } catch (error) {
    console.error('Google user creation error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Invalid user data" });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "User already exists" });
    }
    
    res.status(500).json({ error: "Failed to create Google user" });
  }
});

module.exports = router;
