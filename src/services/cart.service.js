const { Op } = require('sequelize');
const Cart = require('../models/cart.model');
const Book = require('../models/book.model');

const cartService = {
  getCart: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = Cart.findAndCountAll({
          where: {
            userId: { [Op.eq]: id },
          },
          include: [
            {
              model: Book,
              as: 'book',
            },
          ],
          order: [['createdAt', 'ASC']],
          raw: true,
          nest: true,
        });
        return resolve(cart);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getCartQuantity: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cartQuantity = await Cart.count({
          where: {
            userId: { [Op.eq]: id },
          },
          raw: true,
        });
        if (!cartQuantity) resolve(0);
        return resolve(cartQuantity);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getCartByBookId: (userId, bookId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.findOne({
          where: {
            userId: { [Op.eq]: userId },
            bookId: { [Op.eq]: bookId },
          },
          raw: true,
        });
        return resolve(cart);
      } catch (err) {
        return reject(err);
      }
    });
  },
  createNewCart: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.create({
          ...data,
        });
        return resolve(cart);
      } catch (err) {
        return reject(err);
      }
    });
  },
  updateCart: (cart_id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.update(
          {
            ...data,
          },
          {
            where: { id: cart_id },
          }
        );
        return resolve(cart);
      } catch (err) {
        return reject(err);
      }
    });
  },
  updateCartByQuery: (query, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.update(
          {
            ...data,
          },
          {
            where: { ...query },
          }
        );
        return resolve(cart);
      } catch (err) {
        return reject(err);
      }
    });
  },
  deleteCart: async (user_id, book_id) => {
    try {
      const cart = await Cart.destroy({
        where: { userId: user_id, bookId: book_id },
      });
      console.log(cart);
      return cart;
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteMultipleCart: async (user_id) => {
    try {
      const cart = await Cart.destroy({
        where: { userId: user_id },
      });
      return cart;
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = cartService;
