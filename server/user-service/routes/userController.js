const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Find user by email
router.post("/find", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    // Exclude password from response
    const { id, email, provider, name, googleId } = user;
    return res.json({ user: { id, email, provider, name, googleId } });
  } else {
    return res.json({ user: null });
  }
});

// Create user
router.post("/create", async (req, res) => {
  const { email, password, provider, name } = req.body;
  const user = await User.create({ email, password, provider, name });
  if (user) {
    const { id, email, provider, name, googleId } = user;
    return res.json({ user: { id, email, provider, name, googleId } });
  } else {
    return res.json({ user: null });
  }
});

// Validate credentials
router.post("/validate", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, provider: "local" } });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ user: null });
  }
  const { id, email: userEmail, provider, name, googleId } = user;
  return res.json({ user: { id, email: userEmail, provider, name, googleId } });
});

// Google user lookup
router.post("/google/find", async (req, res) => {
  const { googleId } = req.body;
  const user = await User.findOne({ where: { googleId } });
  if (user) {
    const { id, email, provider, name, googleId } = user;
    return res.json({ user: { id, email, provider, name, googleId } });
  } else {
    return res.json({ user: null });
  }
});

// Google user creation
router.post("/google/create", async (req, res) => {
  const { googleId, name, email, provider } = req.body;
  const user = await User.create({ googleId, name, email, provider });
  if (user) {
    const { id, email: userEmail, provider, name, googleId } = user;
    return res.json({
      user: { id, email: userEmail, provider, name, googleId },
    });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
