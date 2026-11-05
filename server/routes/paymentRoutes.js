const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment, validateIdParam } = require('../middlewares/validationMiddleware');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/* Create payment with validation */
router.post('/payments/make', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant'), validatePayment, paymentController.makePayment);

/* List payments */
router.get('/payments', authMiddleware, authorizeRoles('Admin','Manager','Staff','Accountant','Auditor'), paymentController.getAllPayments);

/* Delete payment with validation */
router.delete('/payments/:id', authMiddleware, authorizeRoles('Admin'), validateIdParam, paymentController.deletePayment);
=======

/* Create payment with validation */
router.post('/payments/make', validatePayment, paymentController.makePayment);

/* List payments */
router.get('/payments', paymentController.getAllPayments);

/* Delete payment with validation */
router.delete('/payments/:id', validateIdParam, paymentController.deletePayment);
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

module.exports = router;
