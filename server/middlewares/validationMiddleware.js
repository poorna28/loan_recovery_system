/**
 * Request Validation Middleware
 * Validates request body, params, and query parameters
 */

const validatePayment = (req, res, next) => {
  const { loanId, amount, method } = req.body;

  const errors = [];

  if (loanId === undefined || loanId === null || loanId === '' || isNaN(Number(loanId))) {
    errors.push('loanId is required and must be a number');
  }

  if (amount === undefined || amount === null || amount === '' || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push('amount is required and must be greater than 0');
  }

  if (method && !['CASH', 'CHECK', 'TRANSFER', 'CARD', 'ONLINE'].includes(method)) {
    errors.push('payment method must be one of: CASH, CHECK, TRANSFER, CARD, ONLINE');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLoan = (req, res, next) => {
  // Read BOTH snake_case (what frontend sends) and camelCase (fallback)
  const customer_id  = req.body.customer_id  ?? req.body.customerId;
  const loanAmount   = req.body.loan_amount   ?? req.body.loanAmount;
  const interestRate = req.body.interest_rate ?? req.body.interestRate;
  const loanTerm     = req.body.loan_term     ?? req.body.loanTerm;

  const errors = [];

  if (
    customer_id === undefined ||
    customer_id === null ||
    (typeof customer_id === 'string' && customer_id.trim() === '')
  ) {
    errors.push('customer_id is required');
  }

  if (loanAmount && (isNaN(loanAmount) || Number(loanAmount) <= 0)) {
    errors.push('loan_amount must be a positive number');
  }

  if (interestRate && (isNaN(interestRate) || Number(interestRate) < 0)) {
    errors.push('interest_rate must be a non-negative number');
  }

  if (loanTerm && (isNaN(loanTerm) || Number(loanTerm) <= 0)) {
    errors.push('loan_term must be a positive number (months)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateCustomer = (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  const errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push('firstName is required');
  }

  if (!lastName || lastName.trim() === '') {
    errors.push('lastName is required');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be a valid email address');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (id === undefined || id === null || id === '' || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter. Must be a number.'
    });
  }

  next();
};

module.exports = {
  validatePayment,
  validateLoan,
  validateCustomer,
  validateIdParam
};


// This file defines multiple Express validation middleware functions.
// Their job is to inspect incoming requests, detect invalid data early, and block bad requests before controllers run.

//  Core Validation Strategy Used

// All validators follow the same logical model:

// 1️⃣ Read values from req.body or req.params
// 2️⃣ Build an errors array
// 3️⃣ Push messages for invalid fields
// 4️⃣ If errors exist → Return 400 Bad Request
// 5️⃣ Otherwise → Call next()

// This is a fail-fast design.