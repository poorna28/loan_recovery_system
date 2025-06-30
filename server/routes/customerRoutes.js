const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/basic_info', customerController.createCustomer);

module.exports = router;
