const { DataTypes } = require('sequelize');
const db = require('../config/database');

const OrderStatus = db.define(
  'OrderStatus',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'order_status',
    timestamps: true,
  }
);

module.exports = OrderStatus;
