const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const User = require("../models/user");

// Input validation middleware
const validateUserId = (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  
  next();
};

// POST /testCredentials - Test AWS credentials directly
router.post("/testCredentials", async (req, res) => {
  const { accessKeyId, secretAccessKey } = req.body;
  
  // Validate required fields
  if (!accessKeyId || !secretAccessKey) {
    return res.status(400).json({ error: "Access Key ID and Secret Access Key are required" });
  }
  
  if (accessKeyId.trim() === "" || secretAccessKey.trim() === "") {
    return res.status(400).json({ error: "AWS credentials cannot be empty" });
  }
  
  try {
    // Configure AWS SDK with provided credentials
    const awsConfig = new AWS.Config({
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
      region: process.env.AWS_REGION || "us-east-1",
      maxRetries: 3,
      httpOptions: {
        timeout: 10000,
        connectTimeout: 5000
      }
    });
    
    const sts = new AWS.STS(awsConfig);
    
    // Test AWS connection by getting caller identity
    const identityData = await sts.getCallerIdentity().promise();
    
    res.json({ 
      success: true, 
      awsIdentity: {
        userId: identityData.UserId,
        account: identityData.Account,
        arn: identityData.Arn
      },
      message: "AWS credentials are valid"
    });
    
  } catch (error) {
    console.error('AWS credentials test error:', error);
    
    if (error.code === 'InvalidClientTokenId') {
      return res.status(401).json({ 
        error: "Invalid AWS credentials. Please check your Access Key ID and Secret Access Key." 
      });
    }
    
    if (error.code === 'AccessDenied') {
      return res.status(403).json({ 
        error: "Access denied. Please ensure your AWS credentials have the necessary permissions." 
      });
    }
    
    if (error.code === 'RequestExpired') {
      return res.status(401).json({ 
        error: "AWS credentials have expired. Please update your credentials." 
      });
    }
    
    if (error.code === 'NetworkingError' || error.code === 'TimeoutError') {
      return res.status(408).json({ 
        error: "AWS connection timeout. Please check your internet connection and try again." 
      });
    }
    
    if (error.code === 'CredentialsError') {
      return res.status(401).json({ 
        error: "AWS credentials error. Please verify your credentials are correct." 
      });
    }
    
    // Generic error for other AWS errors
    res.status(500).json({ 
      error: `Failed to connect to AWS: ${error.message || 'Unknown error'}` 
    });
  }
});

// POST /awsConnect - Test AWS connection for existing user
router.post("/awsConnect", validateUserId, async (req, res) => {
  const { userId } = req.body;
  
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.accessKeyId || !user.secretAccessKey) {
      return res.status(400).json({ 
        error: "AWS credentials not found for user. Please link your AWS account first." 
      });
    }
    
    // Configure AWS SDK with user's credentials
    const awsConfig = new AWS.Config({
      accessKeyId: user.accessKeyId,
      secretAccessKey: user.secretAccessKey,
      region: process.env.AWS_REGION || "us-east-1", // Configurable region
      maxRetries: 3,
      httpOptions: {
        timeout: 10000, // 10 second timeout
        connectTimeout: 5000 // 5 second connection timeout
      }
    });
    
    const sts = new AWS.STS(awsConfig);
    
    // Test AWS connection by getting caller identity
    const identityData = await sts.getCallerIdentity().promise();
    
    res.json({ 
      success: true, 
      awsIdentity: {
        userId: identityData.UserId,
        account: identityData.Account,
        arn: identityData.Arn
      },
      message: "AWS connection successful"
    });
    
  } catch (error) {
    console.error('AWS connection error:', error);
    
    if (error.code === 'InvalidClientTokenId') {
      return res.status(401).json({ 
        error: "Invalid AWS credentials. Please check your Access Key ID and Secret Access Key." 
      });
    }
    
    if (error.code === 'AccessDenied') {
      return res.status(403).json({ 
        error: "Access denied. Please ensure your AWS credentials have the necessary permissions." 
      });
    }
    
    if (error.code === 'RequestExpired') {
      return res.status(401).json({ 
        error: "AWS credentials have expired. Please update your credentials." 
      });
    }
    
    if (error.code === 'NetworkingError' || error.code === 'TimeoutError') {
      return res.status(408).json({ 
        error: "AWS connection timeout. Please check your internet connection and try again." 
      });
    }
    
    if (error.code === 'CredentialsError') {
      return res.status(401).json({ 
        error: "AWS credentials error. Please verify your credentials are correct." 
      });
    }
    
    // Generic error for other AWS errors
    res.status(500).json({ 
      error: `Failed to connect to AWS: ${error.message || 'Unknown error'}` 
    });
  }
});

// GET /awsConnect - Get AWS connection status for user
router.get("/awsConnect/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const hasCredentials = !!(user.accessKeyId && user.secretAccessKey);
    
    res.json({
      hasCredentials,
      message: hasCredentials ? "AWS credentials found" : "No AWS credentials linked"
    });
    
  } catch (error) {
    console.error('AWS status check error:', error);
    res.status(500).json({ error: "Failed to check AWS connection status" });
  }
});

module.exports = router;
