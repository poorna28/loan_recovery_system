/**
 * Request Validation Middleware
 * Validates request body, params, and query parameters
 */

// Helper function to sanitize strings (prevent XSS)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 255); // Limit length
};

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
  const applicationDate = req.body.application_date ?? req.body.applicationDate;
  const nextPaymentDue = req.body.next_payment_due ?? req.body.nextPaymentDue;
  const statusApproved = req.body.status_approved ?? req.body.statusApproved;

  const errors = [];
  const today = new Date().toISOString().split('T')[0];

  if (
    customer_id === undefined ||
    customer_id === null ||
    (typeof customer_id === 'string' && customer_id.trim() === '')
  ) {
    errors.push('customer_id is required');
  }

  if (!loanAmount || isNaN(loanAmount) || Number(loanAmount) <= 0 || Number(loanAmount) > 10000000) {
    errors.push('loan_amount must be between 0 and 10,000,000');
  }

  if (interestRate && (isNaN(interestRate) || Number(interestRate) < 0 || Number(interestRate) > 100)) {
    errors.push('interest_rate must be between 0% and 100%');
  }

  if (!loanTerm || isNaN(loanTerm) || Number(loanTerm) <= 0 || Number(loanTerm) > 360) {
    errors.push('loan_term must be between 1 and 360 months');
  }

  if (!applicationDate) {
    errors.push('application_date is required');
  } else if (applicationDate > today) {
    errors.push('application_date cannot be in the future');
  }

  if (nextPaymentDue && applicationDate && nextPaymentDue < applicationDate) {
    errors.push('next_payment_due must be on or after application_date');
  }

  if (statusApproved && !['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'].includes(statusApproved)) {
    errors.push('status_approved must be one of: PENDING, APPROVED, REJECTED, ACTIVE');
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
  const { firstName, lastName, email, phoneNumber, profileStatus, employmentStatus } = req.body;

  const errors = [];

  if (!firstName || firstName.trim() === '') {
    errors.push('firstName is required');
  }

  if (!lastName || lastName.trim() === '') {
    errors.push('lastName is required');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be a valid email address');
  }

  if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
    errors.push('phoneNumber must be a valid 10-digit Indian mobile number (starting with 6-9)');
  }

  if (!profileStatus || !['Active', 'Inactive', 'OnHold'].includes(profileStatus)) {
    errors.push('profileStatus must be one of: Active, Inactive, OnHold');
  }

  if (!employmentStatus || !['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired'].includes(employmentStatus)) {
    errors.push('employmentStatus must be one of: Employed, Self-Employed, Unemployed, Student, Retired');
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
  validateIdParam,
  sanitizeString
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