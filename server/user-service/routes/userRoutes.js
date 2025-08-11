const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");
const authenticateJWT = require("../../shared/middleware/jwtAuth");

router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user has AWS credentials and get identity info
    let awsIdentity = null;
    if (user.accessKeyId && user.secretAccessKey) {
      try {
        const AWS = require("aws-sdk");
        const awsConfig = new AWS.Config({
          accessKeyId: user.accessKeyId,
          secretAccessKey: user.secretAccessKey,
          region: process.env.AWS_REGION || "us-east-1",
          maxRetries: 3,
          httpOptions: {
            timeout: 10000,
            connectTimeout: 5000,
          },
        });
        
        const sts = new AWS.STS(awsConfig);
        const identityData = await sts.getCallerIdentity().promise();
        awsIdentity = {
          userId: identityData.UserId,
          account: identityData.Account,
          arn: identityData.Arn,
        };
      } catch (awsError) {
        console.error("Error fetching AWS identity:", awsError);
        // Don't fail the request, just don't include AWS identity
      }
    }
    
    const safeUser = {
      id: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
      createdAt: user.createdAt,
      awsLinked: Boolean(user.accessKeyId && user.secretAccessKey),
      maskedAccessKeyId: user.accessKeyId
        ? `${user.accessKeyId.slice(0, 4)}********${user.accessKeyId.slice(-4)}`
        : null,
      awsIdentity: awsIdentity,
    };
    res.json({ user: safeUser });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Fixed: use req.user.id from JWT middleware
    if (!userId) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user has AWS credentials and get identity info
    let awsIdentity = null;
    if (user.accessKeyId && user.secretAccessKey) {
      try {
        const AWS = require("aws-sdk");
        const awsConfig = new AWS.Config({
          accessKeyId: user.accessKeyId,
          secretAccessKey: user.secretAccessKey,
          region: process.env.AWS_REGION || "us-east-1",
          maxRetries: 3,
          httpOptions: {
            timeout: 10000,
            connectTimeout: 5000,
          },
        });
        
        const sts = new AWS.STS(awsConfig);
        const identityData = await sts.getCallerIdentity().promise();
        awsIdentity = {
          userId: identityData.UserId,
          account: identityData.Account,
          arn: identityData.Arn,
        };
      } catch (awsError) {
        console.error("Error fetching AWS identity:", awsError);
        // Don't fail the request, just don't include AWS identity
      }
    }
    
    const safeUser = {
      id: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
      createdAt: user.createdAt,
      awsLinked: Boolean(user.accessKeyId && user.secretAccessKey),
      maskedAccessKeyId: user.accessKeyId
        ? `${user.accessKeyId.slice(0, 4)}********${user.accessKeyId.slice(-4)}`
        : null,
      awsIdentity: awsIdentity,
    };
    res.json({ user: safeUser });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
