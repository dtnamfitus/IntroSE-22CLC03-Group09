const orderService = require('../../../services/order.service');
const userService = require('../../../services/user.service');

const getOrderItemList = async (req, res, next) => {
  try {
    if (req.cookies.admin != null) {
      const order = await orderService.getAllOrderAscByDate();
      for (let i = 0; i < order.length; i++) {
        const user = await userService.findUserById(order[i].userId);
        const nameStatus = await statusService.getStatusName(order[i].status);
        order[i]['name'] = user.name;
        order[i]['statusName'] = nameStatus.name;
      }
      res.render('admin/list_orders', {
        layout: 'admin-main',
        order,
        admin: req.cookies.admin,
      });
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {}
};

const getOrderById = async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      const id_order = req.params.id_order;
      const { order, orderItems } = await orderService.getById(id_order);

      res.render('admin/orderdetails', {
        // order,
        // products,
        // layout: 'admin-main',
        // admin: req.cookies.admin,
      });
    } else {
      throw new Error('Unauthorized');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const markOrderPending = async (orderId, adminCookie) => {
  if (!adminCookie) throw new Error('Unauthorized');

  await orderService.updateOrder(orderId, 1);
  return { msg: '' };
};

const markOrderShipping = async (orderId, adminCookie) => {
  if (!adminCookie) throw new Error('Unauthorized');

  await orderService.updateOrder(orderId, 2);
  return { msg: '' };
};

const markOrderDone = async (orderId, adminCookie) => {
  if (!adminCookie) throw new Error('Unauthorized');

  await orderService.updateOrder(orderId, 3);
  return { msg: '' };
};

module.exports = {
  getOrderById,
  markOrderPending,
  markOrderShipping,
  markOrderDone,
  getOrderItemList,
};
