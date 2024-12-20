const orderService = require('../../../services/order.service');
const userService = require('../../../services/user.service');

const getOrderItemList = async (req, res, next) => {
  try {
    if (req.cookies.admin != null) {
      const order = await orderService.getAllOrderAscByDate();
      for (let i = 0; i < order.length; i++) {
        const user = await userService.findUserById(order[i].createdBy);
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

const getOrderById = async (id_order, adminCookie) => {
  if (!adminCookie) throw new Error('Unauthorized');

  const account = await userService.findUserById(id_order);
  return { layout: 'admin-main', admin: account };
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
