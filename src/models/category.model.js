const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Category = db.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
  }
);

Category.sync()
  .then(() => console.log('Category sync successfully'))
  .catch((error) => console.log(error));

module.exports = Category;
