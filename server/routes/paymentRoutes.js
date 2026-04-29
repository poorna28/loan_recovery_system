const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment, validateIdParam } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/* Create payment with validation */
router.post('/payments/make', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant'), validatePayment, paymentController.makePayment);

/* List payments */
router.get('/payments', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor'), paymentController.getAllPayments);

/* Delete payment with validation */
router.delete('/payments/:id', authMiddleware, authorizeRoles('Admin'), validateIdParam, paymentController.deletePayment);

module.exports = router;
