const reportController = require('../controllers/reportController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// GET /api/reports/summary   → Loan Summary tab
router.get('/summary', authMiddleware, authorizeRoles('Admin','Manager','Accountant','Auditor'), reportController.getSummary); 


// GET /api/reports/payments  → Payments tab
router.get('/payments', authMiddleware, authorizeRoles('Admin','Manager','Accountant','Auditor'), reportController.getPayments);

// GET /api/reports/overdue   → Overdue Loans tab
router.get('/overdue', authMiddleware, authorizeRoles('Admin','Manager','Accountant','Auditor'), reportController.getOverdue);

// GET /api/reports/customers → Customer-wise tab
router.get('/customers', authMiddleware, authorizeRoles('Admin','Manager','Auditor'), reportController.getCustomers);

module.exports = router;