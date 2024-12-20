const express = require('express');

const router = express.Router();
const orderController = require('../../app/controllers/customer/order.controller');

router.get('/order_status', orderController.getOrderStatus);
router.get('/order_details/:id_order', orderController.getOrderDetails);

module.exports = router;
