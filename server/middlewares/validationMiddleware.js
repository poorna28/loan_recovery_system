/**
 * Request Validation Middleware
 * Validates request body, params, and query parameters
 */

const validatePayment = (req, res, next) => {
  const { loanId, amount, method } = req.body;

  const errors = [];

  if (!loanId || isNaN(loanId)) {
    errors.push('loanId is required and must be a number');
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
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
  const {
    customer_id,
    loanAmount,
    interestRate,
    loanTerm
  } = req.body;

  const errors = [];

  if (!customer_id || isNaN(customer_id)) {
    errors.push('customer_id is required and must be a number');
  }

  if (loanAmount && (isNaN(loanAmount) || Number(loanAmount) <= 0)) {
    errors.push('loanAmount must be a positive number');
  }

  if (interestRate && (isNaN(interestRate) || Number(interestRate) < 0)) {
    errors.push('interestRate must be a non-negative number');
  }

  if (loanTerm && (isNaN(loanTerm) || Number(loanTerm) <= 0)) {
    errors.push('loanTerm must be a positive number (months)');
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

  if (!id || isNaN(id)) {
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
