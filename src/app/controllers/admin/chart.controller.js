const express = require('express');
const router = express.Router();
const orderService = require('../../../services/order.service');
const orderItemListService = require('../../../services/order_item_lists.service');

router.get('/', async (req, res, next) => {
  const calculateTotalRevenue = (data) =>
    data.reduce(
      (sum, element) =>
        sum + (element.totalPrice ? Number(element.totalPrice) : 0),
      0
    );

  const dates = Array.from(
    { length: 7 },
    (_, i) => new Date(new Date().setDate(new Date().getDate() - i))
  );
  const revenues = await Promise.all(
    dates.map((date) => orderService.getOrderByDay(date))
  );

  let revenue = {};
  let totalRevenue = 0;

  revenues.forEach((data, index) => {
    const total = calculateTotalRevenue(data);
    revenue[`cur${index}`] = total;
    totalRevenue += total;
  });

  const months = Array.from(
    { length: 4 },
    (_, i) => new Date(new Date().setMonth(new Date().getMonth() - i))
  );
  const revenueMonths = await Promise.all(
    months.map((month) => orderService.getOrderByMonth(month.getMonth() + 1))
  );

  let totalRevenueMonth = 0;

  revenueMonths.forEach((data, index) => {
    const total = calculateTotalRevenue(data);
    revenue[`curMonth${index + 1}`] = total;
    totalRevenueMonth += total;
  });

  const listBookRaw = await orderItemListService.getTop4();
  const listBook = listBookRaw[0];

  listBook.forEach((book, index) => {
    revenue[`book${index + 1}`] = book.book_id;
    revenue[`quantity${index + 1}`] = book.sum;
  });

  res.render('admin/chart', {
    layout: 'admin-main',
    revenue,
    totalRevenue,
    totalRevenueMonth,
    listBook,
    admin: req.cookies.admin,
  });
});

module.exports = router;
