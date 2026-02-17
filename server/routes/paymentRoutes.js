const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/make', paymentController.makePayment);

router.get('/payments', paymentController.getAllPayments);
router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;
