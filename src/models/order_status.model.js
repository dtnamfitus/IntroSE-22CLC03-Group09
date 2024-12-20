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

OrderStatus.sync()
  .then(() => console.log('OrderStatus sync successfully'))
  .catch((error) => console.log(error));

module.exports = OrderStatus;
