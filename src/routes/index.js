const adminRoute = require('./admin');
const customerRoute = require('./customer');

function route(app) {
  app.use('/admin', adminRoute);

  app.use('/customer', customerRoute.cartRoute);
  app.use('/customer', customerRoute.checkoutRoute);
  app.use('/customer', customerRoute.homeRoute);
  app.use('/customer', customerRoute.loginRoute);
  app.use('/customer', customerRoute.orderRoute);
  app.use('/customer', customerRoute.register);
  app.use('/customer', customerRoute.reviewRoute);
  app.use('/customer', customerRoute.userRoute);
  app.use('/customer', customerRoute.productRoute);

  app.get('/', function (req, res) {
    res.redirect('/customer/home');
  });
}

module.exports = {
  route,
};
