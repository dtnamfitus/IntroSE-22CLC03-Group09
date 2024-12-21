const bookService = require('../../../services/book.service');
const categoryService = require('../../../services/category.service');
const Paginator = require('paginator');
const cartService = require('../../../services/cart.service');
const helperService = require('../../../services/helper.service');
const userService = require('../../../services/user.service');
const orderService = require('../../../services/order.service');

const ITEMS_PER_PAGE = 4;

const getPaginationInfo = async (totalItems, currentPage, limit) => {
  const paginator = new Paginator(limit, 2);
  return paginator.build(totalItems, currentPage);
};

const getHomePage = async (req, res) => {
  const userId = req.cookies['user']?.id;
  const currentPage =
    !isNaN(Number(req.query.page)) && Number(req.query.page) > 0
      ? Number(req.query.page)
      : 1;

  try {
    const [
      categories,
      totalBooks,
      books,
      latestBooksRaw,
      cartQuantity,
      user,
      orders,
    ] = await Promise.all([
      categoryService.getAllCategories(),
      bookService.getAllBooks(),
      bookService.getBooksLimit(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE
      ),
      bookService.getLatestBooks(),
      userId ? cartService.getCartQuantity(userId) : 0,
      userId ? userService.getUserById(userId) : null,
      userId ? orderService.getOrdersByUserId(userId) : [],
    ]);
    
    const paginationInfo = await getPaginationInfo(
      totalBooks.length,
      currentPage,
      ITEMS_PER_PAGE
    );
    const latestBooks = helperService.formatBooks(latestBooksRaw);

    res.render('customer/home', {
      books,
      latestBooks,
      categories,
      searchUrl: '/customer/products/search',
      layout: 'customer-main',
      user,
      orders,
      cartQuantity,
      pagination_info: paginationInfo,
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).render('customer/error500', { layout: 'customer-main' });
  }
};

module.exports = {
  getHomePage,
};
