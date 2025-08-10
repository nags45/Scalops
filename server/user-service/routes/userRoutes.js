const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");
const authenticateJWT = require("../../shared/middleware/jwtAuth");

router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.userId;
    // Now use userId to fetch user profile
    const user = await User.findOne({ where: { id: userId } });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  try {
    // Now use userId to fetch user profile
    const user = await User.findOne({ where: { id: userId } });
    res.json({ user }); // <-- wrap user in an object
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

module.exports = router;
