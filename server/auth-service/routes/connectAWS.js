const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../shared/middleware/jwtAuth");
const axios = require("axios");

router.post("/link", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { accessKeyId, secretAccessKey } = req.body;
    // Validate AWS credentials are not empty
    if (
      !accessKeyId ||
      !secretAccessKey ||
      accessKeyId.trim() === "" ||
      secretAccessKey.trim() === ""
    ) {
      return res.status(400).json({
        error: "AWS Access Key ID and Secret Access Key must not be empty.",
      });
    }
    // Forward JWT to user-service for authentication
    const response = await axios.post(
      "http://localhost:5001/api/user/link",
      {
        userId,
        accessKeyId,
        secretAccessKey,
      },
      {
        headers: {
          Authorization: req.headers["authorization"],
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error linking account:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to link account" });
  }
});

module.exports = router;
