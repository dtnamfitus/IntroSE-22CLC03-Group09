const express = require('express');

const router = express.Router();

const reviewController = require('../../app/controllers/customer/review.controller');

router.post('/review/create', reviewController.createReview);

module.exports = router;
