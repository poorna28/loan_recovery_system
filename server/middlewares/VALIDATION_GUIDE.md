# Request Validation Middleware Guide

## Overview
The validation middleware layer provides robust request validation for all incoming API requests. This guide explains each validator, how to use it, and best practices.

---

## Available Validators

### 1. **validatePayment**
Validates payment transaction requests.

**Location:** `validationMiddleware.js`

**Required Fields:**
- `loanId` (number) - Must be a valid number
- `amount` (number) - Must be greater than 0
- `method` (string, optional) - One of: `CASH`, `CHECK`, `TRANSFER`, `CARD`, `ONLINE`

**Usage in Routes:**
```javascript
const { validatePayment } = require('../middlewares/validationMiddleware');

router.post('/payments', validatePayment, paymentController.createPayment);
```

**Example Request:**
```json
{
  "loanId": 5,
  "amount": 5000,
  "method": "ONLINE"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "amount is required and must be greater than 0"
  ]
}
```

---

### 2. **validateLoan**
Validates loan creation and update requests.

**Location:** `validationMiddleware.js`

**Required Fields:**
- `customer_id` (number) - Customer identifier
- `loan_amount` (number) - Between 0 and 10,000,000
- `loan_term` (number) - Between 1 and 360 months
- `application_date` (date string) - Cannot be in the future
- `interest_rate` (number, optional) - Between 0% and 100%
- `next_payment_due` (date string, optional) - Must be >= application_date
- `status_approved` (string, optional) - One of: `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`

**Field Naming Convention:**
The validator accepts both **snake_case** (recommended) and **camelCase** for flexibility:
- Client can send: `customer_id` or `customerId`
- Client can send: `loan_amount` or `loanAmount`
- Client can send: `interest_rate` or `interestRate`
- Client can send: `loan_term` or `loanTerm`
- Client can send: `application_date` or `applicationDate`
- Client can send: `next_payment_due` or `nextPaymentDue`
- Client can send: `status_approved` or `statusApproved`

**Usage in Routes:**
```javascript
const { validateLoan } = require('../middlewares/validationMiddleware');

router.post('/loans', validateLoan, loanController.createLoan);
```

**Example Request:**
```json
{
  "customer_id": 10,
  "loan_amount": 500000,
  "interest_rate": 8.5,
  "loan_term": 60,
  "application_date": "2024-01-15",
  "next_payment_due": "2024-02-15",
  "status_approved": "APPROVED"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "loan_amount must be between 0 and 10,000,000",
    "loan_term must be between 1 and 360 months"
  ]
}
```

---

### 3. **validateCustomer**
Validates customer profile creation and update requests.

**Location:** `validationMiddleware.js`

**Required Fields:**
- `firstName` (string) - Not empty
- `lastName` (string) - Not empty
- `email` (string) - Valid email format
- `phoneNumber` (string) - Valid 10-digit Indian mobile number (6-9)
- `profileStatus` (string) - One of: `Active`, `Inactive`, `OnHold`
- `employmentStatus` (string) - One of: `Employed`, `Self-Employed`, `Unemployed`, `Student`, `Retired`

**Usage in Routes:**
```javascript
const { validateCustomer } = require('../middlewares/validationMiddleware');

router.post('/customers', validateCustomer, customerController.createCustomer);
```

**Example Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "profileStatus": "Active",
  "employmentStatus": "Employed"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "phoneNumber must be a valid 10-digit Indian mobile number (starting with 6-9)",
    "profileStatus must be one of: Active, Inactive, OnHold"
  ]
}
```

---

### 4. **validateIdParam**
Validates numeric ID parameters in URL paths.

**Location:** `validationMiddleware.js`

**Requirements:**
- `id` (param) - Must be a valid number

**Usage in Routes:**
```javascript
const { validateIdParam } = require('../middlewares/validationMiddleware');

router.get('/customers/:id', validateIdParam, customerController.getCustomer);
router.put('/loans/:id', validateIdParam, loanController.updateLoan);
router.delete('/payments/:id', validateIdParam, paymentController.deletePayment);
```

**Example URL:**
```
GET /customers/123
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid ID parameter. Must be a number."
}
```

---

## Utility Functions

### **sanitizeString**
Prevents XSS attacks by sanitizing string inputs.

**Exported:** ✅ Yes (available in controllers)

**Location:** `validationMiddleware.js`

**What it does:**
- Removes `<` and `>` characters
- Trims whitespace
- Limits string length to 255 characters

**Usage in Controllers:**
```javascript
const { sanitizeString } = require('../middlewares/validationMiddleware');

const customerController = {
  createCustomer: (req, res) => {
    // Sanitize user input before saving
    const firstName = sanitizeString(req.body.firstName);
    const lastName = sanitizeString(req.body.lastName);
    
    // Continue with controller logic...
  }
};
```

**Example:**
```javascript
// Before sanitization
const input = "<script>alert('XSS')</script>";

// After sanitization
const sanitized = sanitizeString(input);
// Result: "script>alert('XSS')/script"
```

---

## Error Handling

All validators return HTTP **400 Bad Request** with standardized error format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field validation error 1",
    "Field validation error 2"
  ]
}
```

### When Validation Fails:
1. Request processing stops immediately
2. Controller is **NOT called**
3. Error response is sent to client
4. Prevents invalid data from reaching the database

---

## Integration Examples

### Complete Route Setup

```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { 
  validatePayment, 
  validateIdParam 
} = require('../middlewares/validationMiddleware');

// Create payment with validation
router.post('/', validatePayment, paymentController.createPayment);

// Get payment by ID with validation
router.get('/:id', validateIdParam, paymentController.getPayment);

// Update payment (also validate ID)
router.put('/:id', validateIdParam, validatePayment, paymentController.updatePayment);

// Delete payment (validate ID)
router.delete('/:id', validateIdParam, paymentController.deletePayment);

module.exports = router;
```

### Controller with Sanitization

```javascript
const { sanitizeString } = require('../middlewares/validationMiddleware');

const createCustomer = async (req, res) => {
  try {
    // Sanitize inputs
    const firstName = sanitizeString(req.body.firstName);
    const lastName = sanitizeString(req.body.lastName);
    const email = req.body.email.toLowerCase(); // Email in lowercase
    
    // Insert into database
    const result = await db.query(
      'INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?)',
      [firstName, lastName, email]
    );
    
    res.json({ 
      success: true, 
      message: 'Customer created',
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { createCustomer };
```

---

## Best Practices

✅ **DO:**
- Always apply `validateIdParam` to routes with `:id` parameters
- Apply appropriate validators to POST/PUT endpoints
- Sanitize string inputs before saving to database
- Use standardized error response format
- Return 400 for validation errors, not 200

❌ **DON'T:**
- Skip validation middleware on public APIs
- Store unsanitized user input in database
- Mix validation logic across multiple middlewares
- Change error response format inconsistently
- Assume client-side validation is sufficient

---

## Testing Validation

### Example Test Cases

```javascript
// Test: Valid payment request
const validPayment = {
  loanId: 5,
  amount: 10000,
  method: 'ONLINE'
};

// Test: Invalid payment (missing loanId)
const invalidPayment = {
  amount: 10000,
  method: 'ONLINE'
};

// Test: Invalid customer (bad phone number)
const invalidCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '1234567890', // Should start with 6-9
  profileStatus: 'Active',
  employmentStatus: 'Employed'
};
```

---

## Troubleshooting

**Problem:** Validation returns 400 but should pass
- Check field names (snake_case vs camelCase)
- Verify data types (string vs number)
- Check value ranges and patterns

**Problem:** Invalid data reaching the database
- Ensure validator middleware is applied BEFORE controller
- Verify middleware order in route definition
- Use `sanitizeString` for string fields

**Problem:** Duplicate validation errors
- Check if validation is applied multiple times
- Review middleware stacking order
- Ensure only one validator per endpoint

---

## Migration Notes

### From Previous Validation Approach
If migrating from other validation methods:

1. **Replace old validators** → Use middleware validators
2. **Update route imports** → Add `validatePayment`, `validateLoan`, etc.
3. **Remove duplicate validation** → Remove controller-level validation
4. **Update error responses** → Use standardized 400 + errors array format
5. **Sanitize strings** → Use `sanitizeString` in controllers

---

## Related Files

- [MIDDLEWARE_DOCS.md](./MIDDLEWARE_DOCS.md) - Overview of all middleware
- [validationMiddleware.js](./validationMiddleware.js) - Validation implementation
- Routes: `server/routes/*.js` - Route definitions

