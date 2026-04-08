const paymentModel = require('../models/paymentModel');

exports.makePayment = async (req, res) => {
  try {
    // Validation is handled by middleware, proceed directly
    const { loanId, amount, method } = req.body;

    const result = await paymentModel.makePayment(
      Number(loanId),
      Number(amount),
      method
    );

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      payment: result
    });

  } catch (err) {
    console.error('Payment error:', err);

    res.status(500).json({
      success: false,
      message: err.message || 'Payment processing failed',
      errors: [err.message]
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json({ success: true, payments });
  } catch (err) {
    console.error('Fetch payments error:', err);
    res.status(500).json({ success: false, message: err.message, errors: [err.message] });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await paymentModel.deletePaymentById(id);

    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    console.error('Delete payment error:', err);
    const statusCode = err.message === 'Payment not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, message: err.message, errors: [err.message] });
  }
};
