const express = require('express');

const router = express.Router();

const homeController = require('../../app/controllers/customer/home.controller');

router.get('/home', homeController.getHomePage);

module.exports = router;
