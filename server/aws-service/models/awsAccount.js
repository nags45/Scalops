const DataTypes = require("sequelize");
const sequelize = require("../db/sequelize");
const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.AWS_ENCRYPTION_KEY;

const AWSAccount = sequelize.define(
  "AWSAccount",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    awsARN: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("awsARN", encryptAWSARN(value));
      },
      get() {
        const rawValue = this.getDataValue("awsARN");
        return rawValue ? decryptAWSARN(rawValue) : null;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

const encryptAWSARN = (awsARN) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(awsARN, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decryptAWSARN = (encryptedAWSARN) => {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = AWSAccount;
