const loanModel = require('../models/loanModel');

exports.createLoan = async (req, res) => {
  try {
    const loanCustomer = await loanModel.createLoan(req.body);
    res.status(201).json({ message: 'Loan Customer created', loan_id: loanCustomer.loan_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllLoanCustomers = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store'); // disable caching
    const loanCustomers = await loanModel.getAllLoanCustomers();
    res.status(200).json({ loan_customers: loanCustomers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a customer
exports.deleteLoanCustomer = async (req, res) => {
  try {
    const {id: loan_id  } = req.params;
    await loanModel.deleteLoanCustomer(loan_id);
    res.status(200).json({ message: 'Loan Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Update a customer
exports.updateLoanCustomer = async (req, res) => {
  try {
    const { id: loan_id } = req.params;
    const updatePayload = req.body;

    console.log('🔧 Updating Loan Customer:', id);
    console.log('📦 Payload:', updatePayload);

    const result = await loanModel.updateLoanCustomer(loan_id, updatePayload);

    console.log('✅ Update result:', result);
    res.status(200).json({ message: 'Loan Customer updated' });
  } catch (err) {
    console.error('❌ Update error:', err); // This will show full error stack
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
