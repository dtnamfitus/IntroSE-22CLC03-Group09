const express = require('express');

const router = express.Router();
const orderItemListController = require('../app/controllers/admin/order_item_list.controller');

router.get('/list_orders', orderItemListController.getOrderItemList);

module.exports = router;
