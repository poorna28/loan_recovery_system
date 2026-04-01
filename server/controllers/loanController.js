const loanModel = require('../models/loanModel');

/**
 * Safely converts a value to a number.
 * Returns null if the value is empty, undefined, or not a finite number.
 */
const toNum = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const n = Number(val);
  return isFinite(n) ? n : null;
};

/**
 * Reads a field from req.body by trying both snake_case and camelCase keys.
 * This makes the controller resilient to middleware that may rename fields.
 */
const pick = (body, snakeKey, camelKey) => {
  const val = body[snakeKey] ?? body[camelKey];
  return val === undefined ? null : val;
};

// POST /loan_customers
exports.createLoan = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    // Read customer_id (snake only — consistent between frontend and middleware)
    const customer_id = req.body.customer_id;
    if (!customer_id) {
      return res.status(400).json({ message: 'Loan must belong to a customer' });
    }

    // FIX: Use pick() to read BOTH snake_case and camelCase variants.
    // This handles cases where middleware (validateLoan) may transform field names.
    const normalizedPayload = {
      customer_id,
      loan_amount:       toNum(pick(req.body, 'loan_amount',       'loanAmount')),
      loan_purpose:      pick(req.body, 'loan_purpose',      'loanPurpose'),
      interest_rate:     toNum(pick(req.body, 'interest_rate',     'interestRate')),
      loan_term:         toNum(pick(req.body, 'loan_term',         'loanTerm')),
      application_date:  pick(req.body, 'application_date',  'applicationDate') || null,
      status_approved:   pick(req.body, 'status_approved',   'statusApproved'),
      monthly_payment:   toNum(pick(req.body, 'monthly_payment',   'monthlyPayment')),
      next_payment_due:  pick(req.body, 'next_payment_due',  'nextPaymentDue')  || null,
      remaining_balance: toNum(pick(req.body, 'remaining_balance', 'remainingBalance')),
    };

    console.log("📦 Normalized payload for INSERT:", normalizedPayload);

    const loanCustomer = await loanModel.createLoan(normalizedPayload);

    res.status(201).json({
      message: 'Loan Customer created',
      loan_id: loanCustomer.loan_id,
      id: loanCustomer.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /loan_customers
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
    if (!loanCustomer) {
      return res.status(404).json({ message: 'Loan Customer not found' });
    }
    res.status(200).json(loanCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /loan_customers/:id
exports.updateLoanCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await loanModel.getLoanCustomerById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (existing.status_approved === 'ACTIVE') {
      return res.status(400).json({ message: 'ACTIVE loans cannot be updated' });
    }

    // FIX: Same dual-key reading as createLoan — resilient to middleware transforms.
    // FIX: All 10 fields passed to model (previous version omitted monthly_payment,
    //      next_payment_due, remaining_balance — causing them to save as null).
    const updatePayload = {
      customer_id:       pick(req.body, 'customer_id',       'customerId'),
      loan_amount:       toNum(pick(req.body, 'loan_amount',       'loanAmount')),
      loan_purpose:      pick(req.body, 'loan_purpose',      'loanPurpose'),
      interest_rate:     toNum(pick(req.body, 'interest_rate',     'interestRate')),
      loan_term:         toNum(pick(req.body, 'loan_term',         'loanTerm')),
      application_date:  pick(req.body, 'application_date',  'applicationDate') || null,
      status_approved:   pick(req.body, 'status_approved',   'statusApproved'),
      monthly_payment:   toNum(pick(req.body, 'monthly_payment',   'monthlyPayment')),
      next_payment_due:  pick(req.body, 'next_payment_due',  'nextPaymentDue')  || null,
      remaining_balance: toNum(pick(req.body, 'remaining_balance', 'remainingBalance')),
    };

    console.log("📦 Normalized payload for UPDATE:", updatePayload);

    await loanModel.updateLoanCustomerById(id, updatePayload);

    res.status(200).json({ message: 'Loan updated' });

  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /loan_customers/:id
exports.deleteLoanCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await loanModel.getLoanCustomerById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (existing.status_approved === 'ACTIVE') {
      return res.status(400).json({ message: 'ACTIVE loans cannot be deleted' });
    }

    await loanModel.deleteLoanCustomerById(id);
    res.status(200).json({ message: 'Loan deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /loan_customers/customer/:customer_id
exports.getLoansByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const loans = await loanModel.getLoansByCustomerId(customer_id);
    res.status(200).json({ loans });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /loan_customers/:id/status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const existing = await loanModel.getLoanCustomerById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (status === 'ACTIVE') {
      if (existing.status_approved !== 'APPROVED') {
        return res.status(400).json({
          message: 'Loan must be APPROVED before activation',
        });
      }
      await loanModel.activateLoan(id);
      return res.status(200).json({ message: 'Loan activated' });
    }

    const current = existing.status_approved;
    const VALID_TRANSITIONS = {
      PENDING:  ['APPROVED', 'REJECTED'],
      APPROVED: ['ACTIVE', 'REJECTED'],
      ACTIVE:   [],
      REJECTED: [],
    };

    if (!VALID_TRANSITIONS[current]?.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition: ${current} → ${status}`,
      });
    }

    await loanModel.updateStatus(id, status);
    res.status(200).json({ message: 'Status updated' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};