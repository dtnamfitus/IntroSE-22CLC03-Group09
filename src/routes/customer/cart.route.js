const express = require('express');

const router = express.Router();
const cartController = require('../../app/controllers/customer/cart.controller');

router.get('/cart', cartController.getCart);
router.post('/cart/add-to-cart', cartController.addToCart);
router.post('/cart/remove-from-cart', cartController.removeFromCart);
router.post('/cart/increase-quantity', cartController.increaseQuantity);
router.post('/cart/decrease-quantity', cartController.decreaseQuantity);

module.exports = router;
