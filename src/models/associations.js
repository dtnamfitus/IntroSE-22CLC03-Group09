const Book = require('./book.model');
const OrderItemList = require('./order_item_lists.model');

Book.hasMany(OrderItemList, { foreignKey: 'bookId' });
OrderItemList.belongsTo(Book, { foreignKey: 'bookId' });
