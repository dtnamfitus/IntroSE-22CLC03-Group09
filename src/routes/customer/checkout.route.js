const express = require('express');

const router = express.Router();
const checkoutController = require('../../app/controllers/customer/checkout.controller');

router.post('/checkout', checkoutController.checkOut);
router.post('/checkout/create_order', checkoutController.createOrder);

module.exports = router;
