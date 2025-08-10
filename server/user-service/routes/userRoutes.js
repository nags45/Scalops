const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");

router.get("/profile", async (req, res) => {
  try {
    // Forward the token to auth-service for validation
    const response = await axios.get("http://localhost:5000/api/auth/", {
      headers: { Authorization: req.headers.authorization },
    });
    const userId = response.data.userId;
    // Now use userId to fetch user profile
    const user = await User.findOne({ where: { id: userId } });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Forward the token to auth-service for validation
    const response = await axios.get("http://localhost:5000/api/auth/", {
      headers: { Authorization: req.headers.authorization },
    });
    const userId = response.data.userId;
    // Now use userId to fetch user profile
    const user = await User.findOne({ where: { id: userId } });
    res.json({ user }); // <-- wrap user in an object
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

module.exports = router;
