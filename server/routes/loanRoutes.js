const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { validateLoan, validateIdParam } = require('../middlewares/validationMiddleware');

// Create loan with validation
router.post('/loan_customers', validateLoan, loanController.createLoan);

// Get all loans
router.get('/loan_customers', loanController.getAllLoanCustomers);

// Get loan by ID with validation
router.get('/loan_customers/:id', validateIdParam, loanController.getLoanCustomerById);

// Update loan with validation
router.put('/loan_customers/:id', validateIdParam, validateLoan, loanController.updateLoanCustomer);

// Delete loan with validation
router.delete('/loan_customers/:id', validateIdParam, loanController.deleteLoanCustomer);

// Get loans by customer
router.get('/loan_customers/customer/:customer_id', loanController.getLoansByCustomer);

// Update loan status
router.patch('/loan_customers/:id/status', validateIdParam, loanController.updateLoanStatus);

module.exports = router;
