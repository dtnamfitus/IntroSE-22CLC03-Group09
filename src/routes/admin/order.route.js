const express = require('express');

const router = express.Router();
const orderController = require('../../app/controllers/admin/order.controller');

router.get('/:id_order', orderController.getOrderById);

router.post('/mark_pending', orderController.markOrderPending);

router.post('/mark_shipping', orderController.markOrderShipping);

router.post('/mark_done', orderController.markOrderDone);

module.exports = router;
