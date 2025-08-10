const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = generateToken;
