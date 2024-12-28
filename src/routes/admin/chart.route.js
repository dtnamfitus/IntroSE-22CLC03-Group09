const express = require('express');

const router = express.Router();

const chartController = require('../../app/controllers/admin/chart.controller');

router.get('/chart', chartController.getRevenueData);

module.exports = router;
