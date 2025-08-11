const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const axios = require("axios");

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

    // Persist credentials by calling the user-service
    try {
      await axios.post("http://localhost:5001/api/user/awsConnect", {
        userId: userId,
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      });
    } catch (dbError) {
      console.error("Error persisting to database:", dbError);
      // Continue with the response even if database save fails
    }

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

/*router.post("/awsConnect", async (req, res) => {
  const { userId, awsARN } = req.body;

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
    const AWSAccount = await AWSAccount.create({
      userId: userId,
      awsARN: awsARN.trim(),
    });

    res.json({
      success: true,
      awsIdentity: {
        userId: identityData.UserId,
        arn: identityData.Arn,
      },
      message: "AWS credentials are valid",
    });
  } catch (error) {
    console.error("Error linking AWS account:", error);
    return res.status(500).json({ message: "Error linking AWS account" });
  }
});*/

module.exports = router;
