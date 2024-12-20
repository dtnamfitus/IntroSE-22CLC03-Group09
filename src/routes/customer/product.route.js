const express = require('express');

const router = express.Router();
const productController = require('../../app/controllers/customer/products.controller');

router.get('/products', productController.getProducts);
router.get('/product/search', productController.searchProduct);
router.get('/product_details/:id', productController.getProductDetail);

module.exports = router;
