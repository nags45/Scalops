const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const User = require("../models/user");

router.post("/awsConnect", async (req, res) => {
  const { userId, accessKeyId, secretAccessKey } = req.body;

  try {
    // Validate the AWS credentials
    const awsConfig = new AWS.Config({
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
      region: process.env.AWS_REGION || "us-east-1",
      maxRetries: 3,
      httpOptions: {
        timeout: 10000,
        connectTimeout: 5000,
      },
    });

    const sts = new AWS.STS(awsConfig);
    const identityData = await sts.getCallerIdentity().promise();

    // Persist credentials directly using the model
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.accessKeyId = accessKeyId.trim();
    user.secretAccessKey = secretAccessKey.trim();
    await user.save();

    res.json({
      success: true,
      awsIdentity: {
        userId: identityData.UserId,
        account: identityData.Account,
        arn: identityData.Arn,
      },
      message: "AWS credentials are valid",
    });
  } catch (error) {
    console.error("Error linking AWS account:", error);
    return res.status(500).json({ message: "Error linking AWS account" });
  }
});

module.exports = router;
