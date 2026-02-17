const paymentModel = require('../models/paymentModel');

exports.makePayment = async (req, res) => {
  try {
    const { loanId, amount, method } = req.body;

    if (!loanId || !amount) {
      return res.status(400).json({ message: 'Missing payment data' });
    }

    const result = await paymentModel.makePayment(
      loanId,
      Number(amount),
      method
    );

    res.status(200).json({
      message: 'Payment successful',
      payments: [result] // optional pattern consistency
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ✅ REQUIRED FOR FRONTEND */

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await paymentModel.deletePaymentById(id);

    res.status(200).json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
