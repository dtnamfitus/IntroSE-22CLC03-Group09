const Order = require('../models/order.model');
const sequelize = require('sequelize');
const orderService = {
  getOrdersByUserId: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const orders = Order.findAll({
          where: {
            userId: userId,
          },
          raw: true,
        });
        return resolve(orders);
      } catch (error) {
        return reject(error);
      }
    });
  },
  createNewOrder: (newAddress, subTotal, userPhone, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const d = new Date();
        const order = Order.create({
          createtAt: d,
          address: newAddress,
          phone: userPhone,
          totalPrice: subTotal,
          note: null,
          userId: userId,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getShippingOrder: (iduser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findAll({
          where: {
            $and: [{ userId: iduser }, { status: 2 }],
          },
          raw: true,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getPendingOrder: (iduser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findAll({
          where: {
            $and: [{ userId: iduser }, { status: 1 }],
          },
          raw: true,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getDoneOrder: (iduser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findAll({
          where: {
            $and: [{ userId: iduser }, { status: 3 }],
          },
          raw: true,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getById: (id_order) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findOne({
          where: {
            $and: [{ id: id_order }],
          },
          raw: true,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getAllOrderAscByDate: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findAll({
          order: [['createAt', 'ASC']],
          raw: true,
        });
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  updateOrder: (id_order, newStatus) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.update(
          {
            status: newStatus,
          },
          {
            where: { id: id_order },
          }
        );
        resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getOrderByDay: (curDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fromDate = new Date(curDate);
        const toDate = new Date(curDate);
        fromDate.setHours(curDate.getHours() - 12);
        toDate.setHours(curDate.getHours() + 12);
        console.log(Date(fromDate));
        console.log(Date(toDate));
        const order = await Order.findAll({
          attribute: ['total_price'],
          where: {
            $and: [
              sequelize.where(
                sequelize.fn('date_trunc', 'day', sequelize.col('created_at')),
                '>=',
                fromDate
              ),
              sequelize.where(
                sequelize.fn('date_trunc', 'day', sequelize.col('created_at')),
                '<=',
                toDate
              ),
            ],
            status: 3,
          },
          raw: true,
        });
        return resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getOrderByMonth: (curMonth) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findAll({
          where: {
            $and: [
              sequelize.where(
                sequelize.fn('EXTRACT(MONTH FROM', sequelize.col('created_at')),
                ') =',
                curMonth
              ),
            ],
            status: 3,
          },
          raw: true,
        });
        return resolve(order);
      } catch (err) {
        return reject(err);
      }
    });
  },
  deleteOrderById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const result = Order.destroy({
          where: {
            id: id,
          },
        });
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

module.exports = orderService;
