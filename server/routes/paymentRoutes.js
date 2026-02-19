const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment, validateIdParam } = require('../middlewares/validationMiddleware');

/* Create payment with validation */
router.post('/payments/make', validatePayment, paymentController.makePayment);

/* List payments */
router.get('/payments', paymentController.getAllPayments);

/* Delete payment with validation */
router.delete('/payments/:id', validateIdParam, paymentController.deletePayment);

module.exports = router;
