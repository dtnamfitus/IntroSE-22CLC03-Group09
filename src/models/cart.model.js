const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user.model');
const Book = require('./book.model');

const Cart = db.define(
  'Cart',
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
    tableName: 'carts',
    timestamps: true,
  }
);

Cart.sync()
  .then(() => console.log('Cart sync successfully'))
  .catch((error) => console.log(error));

module.exports = Cart;
