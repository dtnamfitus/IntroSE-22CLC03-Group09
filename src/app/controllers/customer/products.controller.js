const Paginator = require('paginator');
const bookService = require('../../../services/book.service');
const categoryService = require('../../../services/category.service');
const cartService = require('../../../services/cart.service');
const helperService = require('../../../services/helper.service');
const orderService = require('../../../services/order.service');
const ITEMS_PER_PAGE = 6;

const getPaginationInfo = (totalItems, currentPage, limit, length = 6) => {
  const paginator = new Paginator(limit, length);
  return paginator.build(totalItems, currentPage);
};

const parseQueryParams = (query) => {
  const pageAsNum = query.page ? Number(query.page[1]) : 1;
  const from = query.from ? Number(query.from[1]) : 0;
  const to = query.to ? Number(query.to[1]) : 1000000000;

  return {
    pageNo: !isNaN(pageAsNum) && pageAsNum > 0 ? pageAsNum : 1,
    from,
    to,
    sortFilter: query.sort || '',
  };
};

const getProducts = async (req, res) => {
  const user = req.cookies['user'];
  const { pageNo, from, to, sortFilter } = parseQueryParams(req.query);

  try {
    const [cartQuantity, orders, categories] = await Promise.all([
      user ? cartService.getCartQuantity(user.id) : 0,
      user ? orderService.getOrdersByUserId(user.id) : [],
      categoryService.getAllCategories(),
    ]);

    const searchFunction =
      sortFilter === ''
        ? bookService.searchBook
        : bookService.searchBookAndSorted;

    const searchByLimitFunction =
      sortFilter === ''
        ? bookService.searchBookByLimit
        : bookService.searchBookAndSortedByLimit;

    const totalBooks = await searchFunction(req.query, from, to);
    const countBooks = totalBooks.length;

    const paginationInfo =
      countBooks > 0
        ? getPaginationInfo(countBooks, pageNo, ITEMS_PER_PAGE)
        : null;

    const products = await searchByLimitFunction(
      req.query,
      ITEMS_PER_PAGE * (pageNo - 1),
      ITEMS_PER_PAGE,
      from,
      to
    );

    res.render('customer/products', {
      user,
      pagination_info: paginationInfo,
      products: helperService.formatBooks(products),
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
        bookService.getBooksByCategoryId(book.categoryId),
      ]);

    Object.assign(book, {
      author: author?.name || 'Unknown',
      publisher: publisher?.name || 'Unknown',
      language: Language[book.language],
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
  getProductDetail,
};

module.exports = {
  getProducts,
  searchProduct,
  getProductDetail,
};
