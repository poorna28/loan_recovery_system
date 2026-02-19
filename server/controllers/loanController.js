

const loanModel = require('../models/loanModel');



exports.createLoan = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ message: 'Loan must belong to a customer' });
    }

    /* ✅ Normalize numeric + optional fields */

    const normalizedPayload = {
      ...req.body,

      loanAmount: req.body.loanAmount === '' ? null : Number(req.body.loanAmount),
      interestRate: req.body.interestRate === '' ? null : Number(req.body.interestRate),
      loanTerm: req.body.loanTerm === '' ? null : Number(req.body.loanTerm),

      monthlyPayment:
        req.body.monthlyPayment === '' ? null : Number(req.body.monthlyPayment),

      remainingBalance:
        req.body.remainingBalance === '' ? null : Number(req.body.remainingBalance),

      nextPaymentDue:
        req.body.nextPaymentDue === '' ? null : req.body.nextPaymentDue,
    };

    const loanCustomer = await loanModel.createLoan(normalizedPayload);

    res.status(201).json({
      message: 'Loan Customer created',
      loan_id: loanCustomer.loan_id,
      id: loanCustomer.id
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};



exports.getAllLoanCustomers = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const loanCustomers = await loanModel.getAllLoanCustomers();
    res.status(200).json({ loan_customers: loanCustomers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /loan_customers/:id
exports.getLoanCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const loanCustomer = await loanModel.getLoanCustomerById(id);
    if (!loanCustomer) return res.status(404).json({ message: 'Loan Customer not found' });
    res.status(200).json(loanCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete by numeric id
// exports.deleteLoanCustomer = async (req, res) => {
//   try {
//     const { id } = req.params; // numeric primary id expected
//     await loanModel.deleteLoanCustomerById(id);
//     res.status(200).json({ message: 'Loan Customer deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

exports.deleteLoanCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await loanModel.getLoanCustomerById(id);

    if (!existing) {
      return res.status(404).json({ message: 'Loan not found' });
    }

if (existing.status_approved === 'ACTIVE') {
  return res.status(400).json({
    message: 'ACTIVE loans cannot be deleted'
  });
}


    await loanModel.deleteLoanCustomerById(id);

    res.status(200).json({ message: 'Loan deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update by numeric id
// exports.updateLoanCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatePayload = req.body;

//     console.log('🔧 Updating Loan Customer id:', id);
//     console.log('📦 Payload:', updatePayload);

//     const result = await loanModel.updateLoanCustomerById(id, updatePayload);

//     console.log('Update result:', result);
//     res.status(200).json({ message: 'Loan Customer updated' });
//   } catch (err) {
//     console.error('❌ Update error:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
exports.updateLoanCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await loanModel.getLoanCustomerById(id);

    if (!existing) {
      return res.status(404).json({ message: 'Loan not found' });
    }
if (existing.status_approved === 'ACTIVE') {
  return res.status(400).json({
    message: 'ACTIVE loans cannot be deleted'
  });
}


const {
  customer_id,
  loanAmount,
  loanPurpose,
  interestRate,
  loanTerm,
  applicationDate,
  statusApproved
} = req.body;

await loanModel.updateLoanCustomerById(id, {
  customer_id,
  loanAmount,
  loanPurpose,
  interestRate,
  loanTerm,
  applicationDate,
  statusApproved
});

    res.status(200).json({ message: 'Loan updated' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getLoansByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const loans = await loanModel.getLoansByCustomerId(customer_id);
    res.status(200).json({ loans });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const existing = await loanModel.getLoanCustomerById(id);
    if (!existing) return res.status(404).json({ message: 'Loan not found' });

    /* Activation Flow */
    if (status === 'ACTIVE') {
      if (existing.status_approved !== 'APPROVED') {
        return res.status(400).json({
          message: 'Loan must be APPROVED before activation'
        });
      }

      await loanModel.activateLoan(id);
      return res.status(200).json({ message: 'Loan activated' });
    }

    // await loanModel.updateStatus(id, status);

    // res.status(200).json({ message: 'Status updated' });

    const current = existing.status_approved;

const VALID_TRANSITIONS = {
  PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: ['ACTIVE', 'REJECTED'],
  ACTIVE: [], // terminal for manual changes
  REJECTED: [] // terminal
};

if (!VALID_TRANSITIONS[current].includes(status)) {
  return res.status(400).json({
    message: `Invalid status transition: ${current} → ${status}`
  });
}

await loanModel.updateStatus(id, status);

res.status(200).json({ message: 'Status updated' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
