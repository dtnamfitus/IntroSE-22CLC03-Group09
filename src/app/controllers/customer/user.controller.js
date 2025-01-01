const express = require('express');
const categoryService = require('../../../services/category.service');
const userService = require('../../../services/user.service');
const _ = require('lodash');
const fileService = require('../../../services/file.service');
const path = require('path');
const appRoot = require('app-root-path');
const bcrypt = require('bcryptjs');
const cartService = require('../../../services/cart.service');
const orderService = require('../../../services/order.service');

const router = express.Router();

// Get user by Id
const getProfile = async (req, res) => {
  const userId = req.cookies['user'].id;
  const cartQuantity = userId ? await cartService.getCartQuantity(userId) : 0;
  const orders = userId ? await orderService.getOrdersByUserId(userId) : [];
  try {
    const { success } = req.query;
    const categories = await categoryService.getAllCategories();
    const user = await userService.getUserById(userId);
    const message = _.isEmpty(success)
      ? null
      : {
          content: success === 'true' ? 'Profile updated' : 'Update failed',
          alert: success === 'true' ? 'success' : 'danger',
        };
    return res.render('customer/profile', {
      user,
      categories,
      message,
      cartQuantity,
      orders,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const body = req.body;
    const { id, oldPassword, ...data } = body;
    const user = await userService.updateUserById(id, data);

    return res.redirect('/customer/user/profile?success=true');
  } catch (error) {
    return res.redirect('/customer/user/profile?success=false');
  }
};

const checkOut = async (req, res) => {
  try {
    return res.render('customer/checkout');
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const uploadDir = path.join(
      appRoot.toString(),
      '/src/public/customers/img/themes/images/profile_pics'
    );
    const options = {
      uploadDir: uploadDir,
      multiples: true,
      maxFileSize: 100 * 1024 * 1024,
      keepExtensions: true,
      filter: function ({ name, originalFilename, mimetype }) {
        return mimetype && mimetype.includes('image');
      },
    };
    const files = await fileService.saveFile(req, options);

    const userId = req.cookies['user'].id;
    const data = {
      avatarUrl: _.isEmpty(files)
        ? null
        : '/customers/img/themes/images/profile_pics/' + files.newFilename,
    };
    const result = await userService.updateUserById(userId, data);
    return res.redirect('/customer/user/profile?success=true');
  } catch (error) {
    return res.redirect('/customer/user/profile?success=false');
  }
};

const getPasswordPage = async (req, res) => {
  const userId = req.cookies['user'].id;
  const cartQuantity = userId ? await cartService.getCartQuantity(userId) : 0;
  const orders = userId ? await orderService.getOrdersByUserId(userId) : [];
  const categories = await categoryService.getAllCategories();
  try {
    const user = await userService.getUserById(userId);
    const { success } = req.query;
    const message = _.isEmpty(success)
      ? null
      : {
          content: success === 'true' ? 'Password updated' : 'Wrong password',
          alert: success === 'true' ? 'success' : 'danger',
        };
    return res.render('customer/change_password', {
      user,
      categories,
      message,
      cartQuantity,
      orders,
    });
  } catch (error) {
    return res.render('customer/error500', {
      cartQuantity,
      categories,
      orders,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const userId = req.cookies['user'].id;
    const user = await userService.getUserById(userId);
    const isCorrectOldPass = await bcrypt.compare(oldPass, user.password);
    if (!isCorrectOldPass) {
      return res.redirect('/customer/user/password?success=false');
    }
    const data = {
      password: await bcrypt.hash(newPass, 10),
    };
    const result = await userService.updateUserById(userId, data);
    if (!result) {
      return res.redirect('/customer/user/password?success=false');
    }
    return res.redirect('/customer/user/password?success=true');
  } catch (error) {
    return res.redirect('/customer/user/password?success=false');
  }
};

module.exports = {
  updateAvatar,
  getProfile,
  editProfile,
  checkOut,
  getPasswordPage,
  changePassword,
};
