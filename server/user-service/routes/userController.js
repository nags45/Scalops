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

// Link accounts
router.post("/link", async (req, res) => {
  const { userId, accessKeyId, secretAccessKey } = req.body;
  // Validate AWS credentials are not empty
  if (
    !accessKeyId ||
    !secretAccessKey ||
    accessKeyId.trim() === "" ||
    secretAccessKey.trim() === ""
  ) {
    return res
      .status(400)
      .json({
        error: "AWS Access Key ID and Secret Access Key must not be empty.",
      });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.accessKeyId = accessKeyId;
    user.secretAccessKey = secretAccessKey;
    await user.save();
    const {
      id,
      email,
      provider,
      name,
      googleId,
      accessKeyId: keyId,
      secretAccessKey: secretKey,
    } = user;
    res.json({
      user: {
        id,
        email,
        provider,
        name,
        googleId,
        accessKeyId: keyId,
        secretAccessKey: secretKey,
      },
    });
  } catch (error) {
    console.error("Error linking account:", error);
    res.status(500).json({ error: "Failed to link account" });
  }
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
