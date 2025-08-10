const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtAuth");

router.get("/", authenticateJWT, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
