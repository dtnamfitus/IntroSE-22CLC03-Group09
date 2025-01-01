const cartService = require('../../../services/cart.service');
const orderService = require('../../../services/order.service');
const orderItemListService = require('../../../services/order_item_lists.service');
const orderStatusService = require('../../../services/order_status.service');
const helperService = require('../../../services/helper.service');

const checkOut = async (req, res) => {
  try {
    const user = req.cookies['user'];
    if (!user) {
      res.render('customer/401', { layout: 'customer-main' });
    } else {
      const address =
        req.body.fname +
        ', ' +
        req.body.ward +
        ', ' +
        req.body.district +
        ', ' +
        req.body.city;
      const cart = await cartService.getCart(user.id);
      const subTotal = cart.rows.reduce((acc, row) => {
        const price = parseFloat(row.book.price);
        const quantity = parseInt(row.quantity, 10);
        return acc + price * quantity;
      }, 0);

      res.render('customer/checkout', { user, address, cart, subTotal });
    }
  } catch (error) {
    res.render('customer/error401');
  }
};

const createOrder = async (req, res) => {
  try {
    const user = req.cookies['user'];

    const [cart, orderStatus] = await Promise.all([
      cartService.getCart(user.id),
      orderStatusService.getByName('Pending'),
    ]);
    const totalPrice = cart.rows.reduce((acc, row) => {
      const price = parseFloat(row.book.price);
      const quantity = parseInt(row.quantity, 10);
      return acc + price * quantity;
    }, 0);
    const newOrder = await orderService.createNewOrder({
      userId: user.id,
      statusId: orderStatus.id,
      address: req.body.address,
      phone: user.phone,
      totalPrice: totalPrice,
      note: '',
    });
    const orderItems = cart.rows.map((row) => ({
      orderId: newOrder.id,
      bookId: row.book.id,
      quantity: row.quantity,
    }));
    await orderItemListService.createOrderItemList(orderItems);
    await cartService.deleteMultipleCart(user.id);
    res.redirect('/customer/order_status');
  } catch (error) {
    res.render('customer/error401');
  }
};

module.exports = {
  checkOut,
  createOrder,
};
