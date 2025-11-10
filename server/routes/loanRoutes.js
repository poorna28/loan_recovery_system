const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/loan_customers', loanController.createLoan);
router.get('/loan_customers', loanController.getAllLoanCustomers);
router.delete('/loan_customers/:id', loanController.deleteLoanCustomer);
router.put('/loan_customers/:id', loanController.updateLoanCustomer);


module.exports = router;
