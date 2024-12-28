const bookService = require('../../../services/book.service');
const reviewService = require('../../../services/review.service');
const userService = require('../../../services/user.service');

const createReview = async (req, res) => {
  const userId = req.cookies['user']?.id;
  const { rating, bookId, comment, username } = req.body;
  try {
    const user = userId ? await userService.getUserById(userId) : null;

    const data = {
      userId,
      rating: Number(rating),
      bookId: Number(bookId),
      username: user ? user.name : username,
      comment,
    };

    await reviewService.createReview(data);

    const allReviews = await reviewService.getReviewsByBookId(bookId);
    const averageRating = Math.round(
      allReviews.reduce((sum, review) => sum + review.rating, 0) /
        allReviews.length
    );
    await bookService.updateBookById(bookId, { overallRating: averageRating });
    return res.redirect(`/customer/product_details/${bookId}`);
  } catch (error) {
    return res.status(500).render('customer/error500');
  }
};

module.exports = {
  createReview,
};
