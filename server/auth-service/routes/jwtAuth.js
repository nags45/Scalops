const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../shared/middleware/jwtAuth");

router.get("/", authenticateJWT, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
