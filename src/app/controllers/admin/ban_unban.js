const express = require('express');
const userService = require('../../../services/user.service');
const app = express();
const router = express.Router();

router.get('/:id_order', async (req, res) => {
  try {
    if (req.cookies.admin != null) {
      const id_order = req.params.id_order;
      const user = await userService.findUserById(id_order);

      if (user.isBanned == true) user.isBanned = false;
      else {
        if (req.cookies.admin.email != user.email) user.isBanned = true;
      }

      userService.updateUserById(id_order, user);

      res.redirect('/admin/banned');
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
