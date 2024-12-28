const userService = require('../../../services/user.service');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const check = await userService.checkIfExists(email);
    if (check) {
      const admin = await userService.findUser(email, password);
      if (admin != null) {
        if (admin.isAdmin == true) {
          if (admin.isBanned == false) {
            res.cookie('admin', admin, {
              onlyHttp: true,
              maxAge: 6000000,
            });
            res.redirect('/admin/home');
          } else {
            res.render('admin/login', {
              message: 'You are Banned!',
              layout: 'admin-main',
            });
          }
        } else {
          res.render('admin/login', {
            message: 'You are not Admin!',
            layout: 'admin-main',
          });
        }
      } else {
        res.render('admin/login', {
          message: 'Wrong email or password!',
          layout: 'admin-main',
        });
      }
    } else {
      res.render('admin/login', {
        message: 'Wrong email or password!',
        layout: 'admin-main',
      });
    }
  } catch (error) {
    res.render('admin/error500', { layout: 'admin-main' });
  }
}

async function logout(req, res) {
  res.clearCookie('admin');
  res.redirect('/admin/login');
}

module.exports = {
  login,
  logout,
};
