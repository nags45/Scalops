const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");
const authenticateJWT = require("../../shared/middleware/jwtAuth");

router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Fixed: was req.userId, should be req.user.id
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Exclude sensitive information
    const { password, accessKeyId, secretAccessKey, ...safeUser } = user.toJSON();
    res.json({ user: safeUser });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Fixed: was req.userId, should be req.user.id
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Exclude sensitive information
    const { password, accessKeyId, secretAccessKey, ...safeUser } = user.toJSON();
    res.json({ user: safeUser });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
