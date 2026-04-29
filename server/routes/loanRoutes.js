const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { validateLoan, validateIdParam } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Create loan with validation
router.post('/loan_customers',   authMiddleware, authorizeRoles('Admin','Manager','Staff'), validateLoan, loanController.createLoan);

// Get all loans
router.get('/loan_customers',   authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor'), loanController.getAllLoanCustomers);

// Get loan by ID with validation
router.get('/loan_customers/:id',   authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor'), validateIdParam, loanController.getLoanCustomerById);

// Update loan with validation
router.put('/loan_customers/:id',   authMiddleware, authorizeRoles('Admin','Manager'), validateIdParam, validateLoan, loanController.updateLoanCustomer);

// Delete loan with validation
router.delete('/loan_customers/:id',   authMiddleware, authorizeRoles('Admin'), validateIdParam, loanController.deleteLoanCustomer);

// Get loans by customer
router.get('/loan_customers/customer/:customer_id',   authMiddleware, authorizeRoles('Admin','Manager','Staff'), loanController.getLoansByCustomer);

// Update loan status
router.patch('/loan_customers/:id/status',   authMiddleware, authorizeRoles('Admin','Manager'), validateIdParam, loanController.updateLoanStatus);

module.exports = router; // export statement at the end of the file
