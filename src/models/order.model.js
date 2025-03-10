const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user.model');
const OrderStatus = require('./order_status.model');

const Order = db.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    totalPrice: {
      field: 'total_price',
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderStatus,
        key: 'id',
      },
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
  }
);

Order.sync()
  .then(() => console.log('Order sync successfully'))
  .catch((error) => console.log(error));

module.exports = Order;
