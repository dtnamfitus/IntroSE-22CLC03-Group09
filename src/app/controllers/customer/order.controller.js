const cartService = require('../../../services/cart.service');
const bookService = require('../../../services/book.service');
const orderService = require('../../../services/order.service');
const orderItemListService = require('../../../services/order_item_lists.service');

const getOrderStatus = async (req, res, next) => {
  let user = req.cookies['user'];
  if (!user)
    return res.render('customer/error401', { layout: 'customer-main' });
  const cartQuantity = user ? await cartService.getCartQuantity(user.id) : 0;
  try {
    var orderList = [];
    const pendingOrder = await orderService.getPendingOrder(user.id);
    for (var i = 0; i < pendingOrder.length; i++) {
      const obj = pendingOrder[i];
      obj['progress'] = 0;
      orderList.push(obj);
    }
    const shippingOrder = await orderService.getShippingOrder(user.id);
    for (var i = 0; i < shippingOrder.length; i++) {
      const obj = shippingOrder[i];
      obj['progress'] = 50;
      ß;
      orderList.push(obj);
    }
    const doneOrder = await orderService.getDoneOrder(user.id);
    for (var i = 0; i < doneOrder.length; i++) {
      const obj = doneOrder[i];
      obj['progress'] = 100;
      orderList.push(obj);
    }

    res.render('customer/order_status', {
      orderList,
      user,
      cartQuantity,
      orders: orderList,
    });
  } catch (error) {
    res.render('/customer/error500', { cartQuantity });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const id_order = req.params.id_order;
    let user = req.cookies['user'];
    if (user == undefined)
      res.render('customer/error500', {
        layout: 'customer-main',
        orders: 0,
        cartQuantity: 0,
      });
    else {
      const orders = await orderService.getOrdersByUserId(user.id);
      const order = await orderService.getById(id_order);
      order['progress'] = (order.status - 1) * 50;
      const orderDetails = await orderItemListService.getById(id_order);
      var products = [];
      for (var i = 0; i < orderDetails.length; i++) {
        obj = orderDetails[i];
        book = await bookService.getBookById(obj.bookId);
        obj['tittle'] = book.title;
        obj['price'] = book.price;
        obj['imageUrl'] = book.imageUrl;
        products.push(obj);
      }
      res.render('customer/order_details', { order, products, user, orders });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getOrderStatus,
  getOrderDetails,
};
