const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Author = db.define(
  'Author',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'authors',
    timestamps: true,
  }
);

Author.sync()
  .then(() => console.log('Author sync successfully'))
  .catch((error) => console.log(error));

module.exports = Author;
