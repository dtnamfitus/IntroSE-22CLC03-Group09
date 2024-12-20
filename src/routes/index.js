const adminRoute = require('./admin');
const customerRoute = require('./customer');

function route(app) {
  app.use('/admin', adminRoute);
  app.use('/customer', customerRoute);
  app.get('/', function (req, res) {
    res.redirect('/customer/home');
  });
}

module.exports = route;
