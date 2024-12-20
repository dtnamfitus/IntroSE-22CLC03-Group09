const express = require('express');

const router = express.Router();
const orderService = require('../../../services/order.service');
const userService = require('../../../services/user.service');

router.get('/:id_order', async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      const id_order = req.params.id_order;
      const account = await userService.findUserById(id_order);
      res.render('admin/update', { layout: 'admin-main', admin: account });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/mark_pending', async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      const updateOrder = await orderService.updateOrder(req.body.id, 1);
      let message = '';
      res.json({ msg: message });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/mark_shipping', async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      let message = '';
      const updateOrder = await orderService.updateOrder(req.body.id, 2);
      res.json({ msg: message });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/mark_done', async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      let message = '';
      const updateOrder = await orderService.updateOrder(req.body.id, 3);
      res.json({ msg: message });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
