const customerModel = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
    const customer = await customerModel.createCustomer(req.body);
    res.status(201).json({ message: 'Customer created', customerId: customer.customerId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();
    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await customerModel.deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = req.body;

    console.log('🔧 Updating customer:', id);
    console.log('📦 Payload:', updatePayload);

    const result = await customerModel.updateCustomer(id, updatePayload);

    console.log('✅ Update result:', result);
    res.status(200).json({ message: 'Customer updated' });
  } catch (err) {
    console.error('❌ Update error:', err); // This will show full error stack
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

