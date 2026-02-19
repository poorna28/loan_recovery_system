const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/* Create payment */
router.post('/payments/make', paymentController.makePayment);

/* List payments */
router.get('/payments', paymentController.getAllPayments);

/* Delete payment */
router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;
