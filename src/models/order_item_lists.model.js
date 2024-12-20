const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Order = require('./order.model');
const Book = require('./book.model');

const OrderItemList = db.define(
  'OrderItemList',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id',
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'order_item_lists',
    timestamps: true,
  }
);

module.exports = OrderItemList;
