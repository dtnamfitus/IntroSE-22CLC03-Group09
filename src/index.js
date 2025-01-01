require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const defineAssociations = require('./models/associations');

require('./models/order.model');
require('./models/order_item_lists.model');
require('./models/book.model');
require('./models/author.model');
require('./models/category.model');
require('./models/cart.model');
require('./models/publisher.model');
require('./models/user.model');
require('./models/review.model');
require('./models/order_status.model');
defineAssociations();

const helper = hbs.create({});
helper.handlebars.registerHelper(
  'forloop',
  function (from, to, incr, url, block) {
    var accum = '';
    for (var i = from; i <= to; i += incr) {
      block.data.index = i;
      block.data.realUrl = url;
      accum += block.fn(i);
    }
    return accum;
  }
);
helper.handlebars.registerHelper('multiply', function (a, b) {
  return a * b;
});

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// Template engine
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.set('port', port);

app.engine(
  'handlebars',
  hbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'customer-main',
  })
);

// Routes
router.route(app);

// Connect to the database and then start the server
db.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  })
  .catch((error) => console.log('Error connecting to the database:', error));
