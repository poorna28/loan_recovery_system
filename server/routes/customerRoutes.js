const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/basic_info', customerController.createCustomer);

router.get('/customers', customerController.getAllCustomers);
router.delete('/customers/:id', customerController.deleteCustomer);
router.put('/customers/:id', customerController.updateCustomer);


module.exports = router;
