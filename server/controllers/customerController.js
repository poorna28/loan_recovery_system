const customerModel = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
    const customer = await customerModel.createCustomer(req.body);
    res.status(201).json({ message: 'Customer created', customerId: customer.customerId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};