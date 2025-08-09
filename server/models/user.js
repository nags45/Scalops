const DataTypes = require('sequelize');
const sequelize = require('../db/sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.ENUM('local', 'google'),
    allowNull: false,
    defaultValue: 'local',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.validatePassword = async function(password) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
