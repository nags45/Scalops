const express = require("express");
const cors = require("cors");
const sequelize = require("./db/sequelize");
const awsConnect = require("./routes/awsConnect");

require("dotenv").config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/aws", awsConnect);

app.get("/api/aws/health", (req, res) => {
  res.json({ status: "AWS service running" });
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err);
  });
