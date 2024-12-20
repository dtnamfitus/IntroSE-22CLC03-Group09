const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const categoryService = require('../../../services/category.service');
const userService = require('../../../services/user.service');

const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const validateRegistrationData = async ({
  name,
  email,
  pass1,
  pass2,
  dob,
  phone,
}) => {
  const errors = [];
  const phoneRegex = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;

  if (!name || !email || !pass1 || !pass2 || !dob || !phone) {
    errors.push({
      message: 'Please enter all fields',
      check: 'alert-danger show',
    });
  }

  if (await userService.checkIfExists(email)) {
    errors.push({
      message: 'Email is already in use',
      check: 'alert-danger show',
    });
  }

  if (pass1.length < 6) {
    errors.push({
      message: 'Password should be at least 6 characters',
      check: 'alert-danger show',
    });
  }

  if (!validateEmail(email)) {
    errors.push({
      message: 'Invalid email format',
      check: 'alert-danger show',
    });
  }

  if (pass1 !== pass2) {
    errors.push({
      message: 'Passwords do not match',
      check: 'alert-danger show',
    });
  }

  if (!phoneRegex.test(phone)) {
    errors.push({
      message: 'Invalid phone number',
      check: 'alert-danger show',
    });
  }

  return errors;
};

const getRegisterPage = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.render('customer/register', {
      layout: 'customer-main',
      categories,
      orders: [],
      cartQuantity: 0,
    });
  } catch (error) {
    console.error('Error fetching register page:', error);
    res.status(500).render('customer/error500');
  }
};

const register = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    const { name, email, pass1, pass2, dob, phone } = req.body;

    const errors = await validateRegistrationData({
      name,
      email,
      pass1,
      pass2,
      dob,
      phone,
    });
    if (errors.length > 0) {
      return res.render('customer/register', { err: errors, categories });
    }

    const hashedPassword = await bcrypt.hash(pass2, 10);
    const userId = uuid();
    await userService.createNewUser(
      userId,
      name,
      email,
      hashedPassword,
      dob,
      phone
    );

    res.render('customer/register', {
      err: [
        { message: 'Registration successful!', check: 'alert-info fade in' },
      ],
      categories,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).render('customer/error500');
  }
};

module.exports = {
  getRegisterPage,
  register,
};
