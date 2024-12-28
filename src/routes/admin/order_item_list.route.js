const express = require('express');

const router = express.Router();
const orderController = require('../../app/controllers/admin/order.controller');

router.get('/list_orders', orderController.getOrderItemList);

module.exports = router;
