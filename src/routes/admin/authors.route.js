const express = require('express');

const router = express.Router();

const authorsController = require('../../app/controllers/admin/authors.controller');

router.get('/table_authors', authorsController.getAuthors);
router.post('/table_authors/create', authorsController.createAuthor);
router.post('/table_authors/update', authorsController.updateAuthor);
router.post('/table_authors/delete', authorsController.deleteAuthor);

module.exports = router;
