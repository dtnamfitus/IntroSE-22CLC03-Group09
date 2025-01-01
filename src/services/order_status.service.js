const OrderStatus = require('../models/order_status.model');

const orderStatusService = {
  getByName: (name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const orderStatus = await OrderStatus.findOne({
          where: {
            name: name,
          },
          raw: true,
        });
        return resolve(orderStatus);
      } catch (error) {
        return reject(error);
      }
    });
  },
  getAll: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const orderStatus = await OrderStatus.findAll({ raw: true });
        return resolve(orderStatus);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

module.exports = orderStatusService;
