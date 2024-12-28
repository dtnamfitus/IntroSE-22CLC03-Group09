const Paginator = require('paginator');
const bookService = require('../../../services/book.service');
const categoryService = require('../../../services/category.service');
const cartService = require('../../../services/cart.service');
const helperService = require('../../../services/helper.service');
const orderService = require('../../../services/order.service');
const authorService = require('../../../services/author.service');
const publisherService = require('../../../services/publisher.service');
const userService = require('../../../services/user.service');
const reviewService = require('../../../services/review.service');
const moment = require('moment');
const _ = require('lodash');

const ITEMS_PER_PAGE = 6;

const getPaginationInfo = (totalItems, currentPage, limit, length = 6) => {
  console.log('Total items:', totalItems);
  console.log('Current page:', currentPage);
  console.log('Limit:', limit);
  const paginator = new Paginator(limit, length);
  return paginator.build(totalItems, currentPage);
};

const parseQueryParams = (query) => {
  const pageAsNum = query.page ? Number(query.page[1]) : 1;
  const from = query.from ? Number(query.from[1]) : 0;
  const to = query.to ? Number(query.to[1]) : 1000000000;

  return {
    name: query.name || null,
    pageNo: !isNaN(pageAsNum) && pageAsNum > 0 ? pageAsNum : 1,
    from,
    to,
    sortFilter: query.sort || '',
    cat: query.cat || null,
  };
};

const getProducts = async (req, res) => {
  const user = req.cookies['user'];
  const cartQuantity = user ? await cartService.getCartQuantity(user.id) : 0;
  const orders = user ? await orderService.getOrdersByUserId(user.id) : [];
  const limit = ITEMS_PER_PAGE;

  try {
    const {
      name = '',
      cat = 0,
      sort = {},
      pageNo,
      from,
      to,
    } = parseQueryParams(req.query);
    const offset = (pageNo - 1) * limit;

    const countBooks = await bookService.countBooks({ name, cat }, from, to);

    const products = await bookService.searchBookByLimit(
      { name, cat, sort },
      offset,
      limit,
      from,
      to
    );

    let pagination_info = getPaginationInfo(countBooks, pageNo, limit);

    if (pagination_info.total_pages < 2) pagination_info = null;

    const categories = await categoryService.getAllCategories();

    const formattedProducts = helperService.formatBooks(products);

    res.render('customer/products', {
      user,
      pagination_info,
      products: formattedProducts,
      categories,
      cartQuantity,
      orders,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('customer/error500');
  }
};

const searchProduct = async (req, res) => {
  try {
    const query = { ...req.query };
    const products = await bookService.searchBook(query);

    res.render('customer/products', {
      products: helperService.formatBooks(products),
      searchUrl: 'customer/products/search',
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while searching products' });
  }
};

const getProductDetail = async (req, res) => {
  const userId = req.cookies['user']?.id;

  try {
    const [cartQuantity, orders] = await Promise.all([
      userId ? cartService.getCartQuantity(userId) : 0,
      userId ? orderService.getOrdersByUserId(userId) : [],
    ]);

    const id = req.params.id;
    const bookData = await bookService.getBookById(id);
    const book = helperService.formatBooks(bookData);

    const reviews = await getDetailedReviews(id);

    const [author, publisher, user, categories, relatedBooksRaw] =
      await Promise.all([
        authorService.getAuthorById(book.authorId),
        publisherService.getPublisherById(book.publisherId),
        userId ? userService.getUserById(userId) : null,
        categoryService.getAllCategories(),
        bookService.getRelatedBooks(book.categoryId),
      ]);

    Object.assign(book, {
      author: author?.name || 'Unknown',
      publisher: publisher?.name || 'Unknown',
      star: book.overallRating,
      starLeft: 5 - book.overallRating,
    });

    const relatedBooks = helperService.formatBooks(relatedBooksRaw);

    res.render('customer/product_details', {
      user,
      book,
      relatedBooks,
      categories,
      cartQuantity,
      reviews,
      orders,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.render('customer/error500', { cartQuantity, orders });
  }
};

const getDetailedReviews = async (bookId) => {
  const reviews = await reviewService.getReviewsByBookId(bookId);
  if (_.isEmpty(reviews)) return [];

  const userPromises = reviews
    .filter((review) => review.userId)
    .map((review) => userService.getUserById(review.userId));
  const userDetails = await Promise.all(userPromises);

  return reviews.map((review) => {
    const user = userDetails.find((user) => user.id === review.userId);
    const star = review.rating;
    const starLeft = 5 - star;
    const createdAt = moment(review.createdAt).format('MMM DD YYYY');
    return { ...review, user, star, starLeft, createdAt };
  });
};

module.exports = {
  getProducts,
  searchProduct,
  getProductDetail,
};
