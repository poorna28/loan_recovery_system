const paymentModel = require('../models/paymentModel');

exports.makePayment = async (req, res) => {
  try {
    const { loanId, amount, method } = req.body;

    const numericLoanId = Number(loanId);
    const numericAmount = Number(amount);

    if (isNaN(numericLoanId)) {
      return res.status(400).json({ message: 'Invalid loanId' });
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const result = await paymentModel.makePayment(
      numericLoanId,
      numericAmount,
      method
    );

    res.status(200).json({
      message: 'Payment successful',
      payment: result
    });

  } catch (err) {
    console.error('Payment error:', err);

    res.status(500).json({
      message: err.message || 'Payment processing failed'
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json({ payments });
  } catch (err) {
    console.error('Fetch payments error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await paymentModel.deletePaymentById(id);

    res.status(200).json({ message: 'Payment deleted' });
  } catch (err) {
    console.error('Delete payment error:', err);
    res.status(500).json({ message: err.message });
  }
};
