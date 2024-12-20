const express = require('express');

const router = express.Router();

const loginController = require('../../app/controllers/customer/login.controller');

router.get('/login', loginController.getLoginPage);

router.post('/login/find', loginController.verifyAccount);

router.get('/logout', async (req, res) => {
  res.clearCookie('user');
  return res.redirect('/');
});

module.exports = router;
