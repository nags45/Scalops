const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const localAuthRoutes = require("./routes/localAuth");
const googleAuthRoutes = require("./routes/googleOAuth");
const jwtAuthRoutes = require("./routes/jwtAuth");
const connect = require("./routes/connectAWS");
require("./strategies/googleOAuthStrategy");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// Local auth routes: /api/auth/login, /api/auth/register
app.use("/api/auth", localAuthRoutes);

// Google OAuth routes: /api/auth/google, /api/auth/google/callback
app.use("/api/auth", googleAuthRoutes);

// JWT validation route: /api/auth/
app.use("/api/auth", jwtAuthRoutes);

// Connect AWS account route: /api/auth/link
app.use("/api/auth", connect);

app.get("/api/auth/health", (req, res) => {
  res.json({ status: "Auth service running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
