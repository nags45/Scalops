const express = require("express");
const router = express.Router();
const generateToken = require("../utils/jwt");
const axios = require("axios");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // User-service should validate credentials and return user if valid
    const response = await axios.post(
      "http://localhost:5001/api/user/validate",
      { email, password }
    );
    const user = response.data.user;
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const response = await axios.post("http://localhost:5001/api/user/find", {
    email,
  });
  const existingUser = response.data.user;
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
    "http://localhost:5001/api/user/create",
    { email, password, provider: "local", name }
  );
  const user = createResponse.data.user;
  const token = generateToken(user);
  res.status(201).json({ token });
});

module.exports = router;
