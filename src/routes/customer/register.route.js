const express = require('express');

const router = express.Router();

const registerController = require('../../app/controllers/customer/register.controller');

router.get('/register', registerController.getRegisterPage);
router.post('/register', registerController.register);

module.exports = router;
