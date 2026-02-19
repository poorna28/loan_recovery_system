# Middleware Documentation

## Overview
The application uses several layers of middleware to handle cross-cutting concerns like logging, validation, error handling, and rate limiting. This ensures consistent behavior across all endpoints.

---

## Backend Middleware (Server)

### 1. **Logging Middleware** (`loggingMiddleware.js`)
**Purpose:** Tracks all HTTP requests and responses

**Features:**
- Generates unique request IDs for tracking
- Logs HTTP method, URL, query parameters, and request body
- Tracks response status codes and response time
- Color-coded output (✅ success, ⚠️ redirect, ❌ error)

**Usage:**
```javascript
app.use(loggingMiddleware);
```

**Output Example:**
```
📥 [abc123] GET /api/customers | Query: {"page":"1"}
✅ [abc123] GET /api/customers → 200 | 45ms
```

---

### 2. **Rate Limiting Middleware** (`rateLimitMiddleware.js`)
**Purpose:** Prevents abuse by limiting requests per IP address

**Configuration:**
- Default: 100 requests per 15 minutes
- Customizable via `rateLimitMiddleware(maxRequests, timeWindow)`

**Features:**
- Tracks requests per IP
- Returns 429 (Too Many Requests) when limit exceeded
- Adds rate limit headers to responses
- Auto-cleanup of expired entries

**Usage:**
```javascript
app.use(rateLimitMiddleware(100, 15 * 60 * 1000));
```

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
```

---

### 3. **Validation Middleware** (`validationMiddleware.js`)
**Purpose:** Validates request body, params, and query data

**Available Validators:**

#### `validatePayment`
Used on: `POST /api/payments/make`
```javascript
Validates:
- loanId: required, must be number
- amount: required, must be > 0
- method: CASH | CHECK | TRANSFER | CARD | ONLINE
```

#### `validateLoan`
Used on: `POST /api/loan_customers`, `PUT /api/loan_customers/:id`
```javascript
Validates:
- customer_id: required, must be number
- loanAmount: must be positive (if provided)
- interestRate: must be non-negative (if provided)
- loanTerm: must be positive number (if provided)
```

#### `validateCustomer`
Used on: `POST /api/basic_info`, `PUT /api/customers/:id`
```javascript
Validates:
- firstName: required, non-empty
- lastName: required, non-empty
- email: valid email format (if provided)
```

#### `validateIdParam`
Used on all endpoints with ID parameters
```javascript
Validates:
- id parameter must be a number
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "loanId is required and must be a number",
    "amount must be greater than 0"
  ]
}
```

---

### 4. **Authentication Middleware** (`authMiddleware.js`)
**Purpose:** Verifies JWT tokens and protects routes

**Features:**
- Extracts JWT from Authorization header
- Verifies token signature
- Handles expired/invalid tokens
- Attaches user info to request object

**Usage:**
```javascript
router.post('/protected-route', authMiddleware, controller.method);
```

**Token Format:**
```
Authorization: Bearer <jwt_token>
```

**Error Responses:**
- 401: No token provided
- 401: Token expired
- 401: Invalid token

---

### 5. **Error Handler Middleware** (`errorHandler.js`)
**Purpose:** Centralized error handling for all endpoints

**Features:**
- Catches all errors from routes
- Standardizes error response format
- Handles specific error types (validation, database, etc.)
- Includes stack traces in development mode

**Handled Error Types:**
- ValidationError (400)
- UnauthorizedError (401)
- ForbiddenError (403)
- Duplicate entries (409)
- Database reference errors (400)
- Generic errors (500)

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "message": "Validation Error",
    "statusCode": 400,
    "details": ["Field required", "Invalid format"]
  },
  "timestamp": "2024-02-19T10:30:45.123Z"
}
```

**Usage:**
```javascript
// Must be last in middleware chain
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});
```

---

## Frontend Middleware (Client)

### **API Interceptors** (`api.js`)
**Purpose:** Central request/response handling

#### Request Interceptor
- Logs outgoing requests
- Adds JWT token to Authorization header if available

#### Response Interceptor
- Logs successful responses
- Handles 401 (session expired) → redirects to login
- Handles 403 (access denied)
- Handles 429 (rate limited)
- Rejects promise for error handling in components

**Usage:**
```javascript
api.get('/endpoint')
  .then(res => { /* Handle success */ })
  .catch(err => { /* Handle error */ });
```

---

## Middleware Chain Order

The order of middleware in app.js is critical:

```
1. CORS & Body Parser (built-in)
2. Logging Middleware (logs all requests)
3. Rate Limiting (prevents abuse)
4. Static Files (uploads folder)
5. Routes with Validation (validates data)
6. Error Handler (catches all errors) - MUST BE LAST
```

---

## Implementation Guide

### Using Validation on Routes

**Before (No Validation):**
```javascript
router.post('/payments/make', paymentController.makePayment);
```

**After (With Validation):**
```javascript
const { validatePayment } = require('../middlewares/validationMiddleware');

router.post('/payments/make', validatePayment, paymentController.makePayment);
```

### Using Authentication on Routes

```javascript
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route
router.get('/protected', authMiddleware, controller.method);
```

### Creating Custom Validators

```javascript
const customValidator = (req, res, next) => {
  // Your validation logic
  if (/* validation fails */) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['Error message']
    });
  }
  // Pass to next middleware
  next();
};

// Use it
router.post('/endpoint', customValidator, controller.method);
```

---

## Monitoring & Debugging

### Check Request Logs
Browser Console (Frontend):
```
📤 [GET] /api/customers
✅ [200] GET /api/customers
```

Terminal (Backend):
```
📥 [abc123] GET /api/customers
✅ [abc123] GET /api/customers → 200 | 45ms
```

### Common Issues

**Problem:** No logs showing
- Check if `loggingMiddleware` is added to app.js
- Middleware must be added BEFORE routes

**Problem:** Validation not working
- Ensure validator is placed BEFORE controller in route
- Order matters: `validatePayment, controller.method`

**Problem:** Errors not caught
- Error handler must be LAST in middleware chain
- Use `(err, req, res, next)` with 4 parameters

---

## Performance Considerations

- **Logging:** Minimal overhead, useful for development
- **Rate Limiting:** In-memory storage, suitable for single server
  - For distributed apps, use Redis-based rate limiter
- **Validation:** Quick string/number checks, <1ms typical
- **Error Handler:** Only processes when error occurs

---

## Security Best Practices

✅ Always validate user input  
✅ Use rate limiting on public endpoints  
✅ Verify JWT tokens on protected routes  
✅ Log suspicious activity  
✅ Return generic error messages to clients  
✅ Disable debug info in production  

---

## Future Enhancements

- [ ] Redis-based rate limiting for scalability
- [ ] Request body size limits
- [ ] HELMET.js for security headers
- [ ] Request schema validation (JOI/Yup)
- [ ] Database query logging
- [ ] Performance metrics middleware
- [ ] CSRF protection
