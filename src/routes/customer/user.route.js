const express = require('express');

const router = express.Router();

const userController = require('../../app/controllers/customer/user.controller');

router.get('/user/profile', userController.getProfile);
router.post('/user/edit', userController.editProfile);
router.get('/user/:id/checkout', userController.checkOut);
router.get('/user/password', userController.getPasswordPage);
router.post('/user/updateAvatar', userController.updateAvatar);
router.post('/user/password/change', userController.changePassword);

module.exports = router;
