const reportController = require('../controllers/reportController');
const express = require('express');
const router = express.Router();

// GET /api/reports/summary   → Loan Summary tab
router.get('/summary',   reportController.getSummary); 


// GET /api/reports/payments  → Payments tab
router.get('/payments',  reportController.getPayments);

// GET /api/reports/overdue   → Overdue Loans tab
router.get('/overdue',   reportController.getOverdue);

// GET /api/reports/customers → Customer-wise tab
router.get('/customers', reportController.getCustomers);

module.exports = router;