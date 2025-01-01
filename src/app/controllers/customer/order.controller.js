const cartService = require('../../../services/cart.service');
const bookService = require('../../../services/book.service');
const orderService = require('../../../services/order.service');
const orderItemListService = require('../../../services/order_item_lists.service');
const orderStatusService = require('../../../services/order_status.service');

const getOrderStatus = async (req, res, next) => {
  const user = req.cookies['user'];
  if (!user) {
    return res.render('customer/error401', { layout: 'customer-main' });
  }
  try {
    const [orderList, orderStatus] = await Promise.all([
      orderService.getOrdersByUserId(user.id),
      orderStatusService.getAll(),
    ]);
    const progress = orderList.status * 20;
    res.render('customer/order_status', {
      orderList,
      orderStatus,
      user,
      progress,
    });
  } catch (error) {
    res.render('customer/error500', { cartQuantity });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const user = req.cookies['user'];
    if (!user) {
      return res.render('customer/error401', { layout: 'customer-main' });
    }
    const id_order = req.params.id_order;
    const orders = await orderService.getById(id_order);
    const { address, phone, email, createdAt, totalPrice, status } = orders[0];
    const progress = orders[0].status * 20;
    res.render('customer/order_details', {
      orders,
      progress,
      user,
      address,
      phone,
      email,
      createdAt,
      totalPrice,
      status,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getOrderStatus,
  getOrderDetails,
};
