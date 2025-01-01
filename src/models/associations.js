const Book = require('./book.model');
const OrderItemList = require('./order_item_lists.model');
const Cart = require('./cart.model');
const Order = require('./order.model');
const OrderStatus = require('./order_status.model');

const defineAssociations = () => {
  Book.hasMany(OrderItemList, { foreignKey: 'bookId' });
  OrderItemList.belongsTo(Book, { foreignKey: 'bookId' });

  Cart.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
  Book.hasMany(Cart, { foreignKey: 'bookId', as: 'carts' });

  Order.hasMany(OrderItemList, { foreignKey: 'orderId', as: 'items' });
  OrderItemList.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  Order.belongsTo(OrderStatus, { foreignKey: 'statusId', as: 'status' });
};

module.exports = defineAssociations;
