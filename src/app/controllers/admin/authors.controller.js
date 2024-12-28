const express = require('express');
const router = express.Router();
const authorService = require('../../../services/author.service');
const bookService = require('../../../services/book.service');
const _ = require('lodash');

async function getAuthors(req, res) {
  try {
    if (req.cookies.admin != null) {
      const { success } = req.query;
      const authors = await authorService.getAllAuthor();
      const message = _.isEmpty(success)
        ? null
        : {
            content: success === 'true' ? 'Author deleted' : 'Deleted failed',
            alert: success === 'true' ? 'success' : 'danger',
          };
      res.render('admin/table_authors', {
        layout: 'admin-main',
        authors,
        admin: req.cookies.admin,
        message,
      });
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    res.render('admin/error500', { layout: 'admin-main' });
  }
}

async function createAuthor(req, res) {
  try {
    if (req.cookies.admin != null) {
      await authorService.createAuthor(data.author);
      return res.redirect('/admin/table_authors');
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    res.render('admin/error500', { layout: 'admin-main' });
  }
}

async function updateAuthor(req, res) {
  try {
    if (req.cookies.admin != null) {
      const data = req.body;
      await authorService.updateAuthor(data.name, data.id);

      return res.redirect('/admin/table_authors');
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    res.render('admin/error500', { layout: 'admin-main' });
  }
}

async function deleteAuthor(req, res) {
  try {
    if (req.cookies.admin != null) {
      const data = req.body;
      await bookService.deleteBookByAuthor(data.id);
      await authorService.deleteAuthor(data.id);
      return res.redirect('/admin/table_authors?success=true');
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    return res.render('admin/error500', { layout: 'admin-main' });
  }
}

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
