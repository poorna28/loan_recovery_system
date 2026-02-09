const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/loan_customers', loanController.createLoan);
router.get('/loan_customers', loanController.getAllLoanCustomers);
router.get('/loan_customers/:id', loanController.getLoanCustomerById);
router.put('/loan_customers/:id', loanController.updateLoanCustomer);
router.delete('/loan_customers/:id', loanController.deleteLoanCustomer);

router.get('/loan_customers/customer/:customer_id', loanController.getLoansByCustomer);


module.exports = router;
