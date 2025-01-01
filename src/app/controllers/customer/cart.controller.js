const cartService = require('../../../services/cart.service');
const _ = require('lodash');

const getCart = async (req, res) => {
  try {
    const user = req.cookies['user'];
    if (user == undefined)
      return res.render('customer/error401', { layout: 'customer-main' });
    else {
      const cart = await cartService.getCart(user.id);

      if (!cart || cart.rows.length === 0) {
        return res.render('customer/cart', {
          user,
          subTotal: 0,
          cart: { rows: [] },
          layout: 'customer-main',
        });
      }
      const subTotal = cart.rows.reduce((acc, row) => {
        const price = parseFloat(row.book.price);
        const quantity = parseInt(row.quantity, 10);
        return acc + price * quantity;
      }, 0);

      return res.render('customer/cart', {
        user,
        layout: 'customer-main',
        cart,
        subTotal,
      });
    }
  } catch (error) {
    res.render('customer/error500');
  }
};

const addToCart = async (req, res) => {
  try {
    const user = req.cookies['user'];
    const params = { book_id: req.body.id, quantity: '1' };
    const existCart = await cartService.getCartByBookId(
      user.id,
      params.book_id
    );
    if (existCart == null) {
      await cartService.createNewCart({
        userId: user.id,
        bookId: params.book_id,
        quantity: params.quantity,
      });
    } else {
      // check wheather book is existing in your cart or not
      await cartService.updateCart(existCart.id, {
        quantity: existCart.quantity + 1,
      });
    }
    res.json({ msg: 'Thêm sản phẩm thành công' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const removeFromCart = async (req, res) => {
  try {
    let user = req.cookies['user'];
    const book_id = req.body.id;
    await cartService.deleteCart(user.id, parseInt(book_id));
    res.json({ msg: 'Xoá khỏi giỏ hàng thành công' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const user = req.cookies['user'];
    const existCart = await cartService.getCartByBookId(user.id, req.body.id);
    if (existCart == null) {
      return res.json({ msg: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    await cartService.updateCartByQuery(
      {
        userId: user.id,
        bookId: req.body.id,
      },
      {
        quantity: existCart.quantity + 1,
      }
    );
    return res.json({ msg: 'Thành công' });
  } catch (error) {}
};

const decreaseQuantity = async (req, res) => {
  try {
    const user = req.cookies['user'];
    const existCart = await cartService.getCartByBookId(user.id, req.body.id);
    if (existCart == null) {
      return res.json({ msg: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    if (existCart.quantity === 1) {
      await cartService.deleteCart(user.id, req.body.id);
      return res.json({ msg: 'Xoá khỏi giỏ hàng thành công' });
    } else {
      await cartService.updateCartByQuery(
        {
          userId: user.id,
          bookId: req.body.id,
        },
        {
          quantity: existCart.quantity - 1,
        }
      );
      return res.json({ msg: 'Thành công' });
    }
  } catch (error) {}
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};
