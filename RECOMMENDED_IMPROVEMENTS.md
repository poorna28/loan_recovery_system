# 🔧 RECOMMENDED IMPROVEMENTS & CODE REFACTORING

**Date:** April 23, 2026

---

## 1. IMMEDIATE SECURITY FIXES (Do This Week)

### Fix 1.1: JWT Secret Management
**File:** `server/config/auth.js` (NEW FILE)

```javascript
/**
 * Authentication Configuration
 * Manages JWT settings and validation
 */

const validateAuthConfig = () => {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET environment variable is not set');
  }

  if (JWT_SECRET === 'your-secret-key' || JWT_SECRET.length < 32) {
    throw new Error(
      '❌ JWT_SECRET is too weak. Must be 32+ characters and NOT a default value'
    );
  }

  console.log('✅ Authentication config validated');
};

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  validateAuthConfig
};
```

**Update:** `server/server.js`
```javascript
const authConfig = require('./config/auth');
authConfig.validateAuthConfig(); // Call on startup

const authMiddleware = require('./middlewares/authMiddleware');
// Use authConfig.JWT_SECRET instead of hardcoded fallback
```

---

### Fix 1.2: Environment Variable Validation
**File:** `server/config/env.js` (NEW FILE)

```javascript
/**
 * Environment Configuration Validator
 * Ensures all required env vars are set on startup
 */

const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'PORT'
];

const OPTIONAL_ENV_VARS = {
  NODE_ENV: 'development',
  LOG_LEVEL: 'info',
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000
};

const validateEnvironment = () => {
  const missing = [];
  const errors = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    errors.push(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters');
  }

  // Validate port is numeric
  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    errors.push('PORT must be a number');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  // Set defaults for optional variables
  Object.entries(OPTIONAL_ENV_VARS).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });

  console.log('✅ All environment variables validated');
};

module.exports = { validateEnvironment };
```

**Update:** `server/server.js` - Call this first
```javascript
require('dotenv').config();
const { validateEnvironment } = require('./config/env');
validateEnvironment(); // Call FIRST, before anything else
```

---

### Fix 1.3: Password Strength Validation
**File:** `server/utils/passwordValidator.js` (NEW FILE)

```javascript
/**
 * Password Strength Validator
 * Enforces password complexity requirements
 */

const validatePasswordStrength = (password) => {
  const errors = [];
  const warnings = [];

  // Required checks
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[@$!%*?&#^()_+=\-\[\]{}|;:'",.<>?/\\]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#^)');
  }

  // Warning checks (weak patterns)
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Avoid repeating characters (aaa, 111)');
  }

  if (/^[a-z]*[A-Z]*[0-9]*$/.test(password)) {
    warnings.push('Avoid grouping character types together');
  }

  if (/password|123456|qwerty/i.test(password)) {
    errors.push('Password is too common. Please choose a different password');
  }

  return {
    valid: errors.length === 0,
    score: calculateScore(password),
    errors,
    warnings
  };
};

const calculateScore = (password) => {
  let score = 0;
  
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;

  return Math.min(100, score);
};

module.exports = { validatePasswordStrength, calculateScore };
```

**Usage in** `server/controllers/authController.js`:
```javascript
const { validatePasswordStrength } = require('../utils/passwordValidator');

exports.signup = async (req, res) => {
  const { password } = req.body;
  const validation = validatePasswordStrength(password);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet requirements',
      errors: validation.errors,
      passwordStrength: validation.score
    });
  }

  // Continue with signup...
};
```

---

### Fix 1.4: httpOnly Cookies Instead of localStorage
**File:** `server/utils/tokenManager.js` (NEW FILE)

```javascript
/**
 * Token Management
 * Handles JWT creation and cookie management
 */

const jwt = require('jsonwebtoken');

const createToken = (userId, userEmail) => {
  return jwt.sign(
    { id: userId, email: userEmail },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('authToken', token, {
    httpOnly: true,                           // Prevents JS access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',                       // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,            // 24 hours
    path: '/'
  });
};

const clearTokenCookie = (res) => {
  res.cookie('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
};

module.exports = {
  createToken,
  setTokenCookie,
  clearTokenCookie
};
```

**Update** `server/controllers/authController.js`:
```javascript
const { createToken, setTokenCookie } = require('../utils/tokenManager');

exports.login = async (req, res) => {
  // ... validation code ...

  // Instead of sending token in response:
  const token = createToken(user.id, user.email);
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name }
    // Token is in httpOnly cookie, not in response
  });
};
```

**Update API requests** - Remove manual token handling:
```javascript
// client/src/services/api.js
// Remove: const token = localStorage.getItem('token');

// Add: Enable credentials for cookie transport
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true  // Send cookies with requests
});

// Remove token from Authorization header:
// api.interceptors.request.use(...) - no manual token code
```

---

### Fix 1.5: Rate Limiting on Auth Endpoints
**File:** `server/middlewares/authRateLimitMiddleware.js` (NEW FILE)

```javascript
/**
 * Auth Rate Limiting Middleware
 * Stricter limits for authentication endpoints
 */

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts max
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
    retryAfter: 900
  },
  standardHeaders: true,      // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Rate limit by IP + email (if available)
    return req.body.email ? `${req.ip}-${req.body.email}` : req.ip;
  }
});

module.exports = authLimiter;
```

**Update** `server/routes/authRoutes.js`:
```javascript
const authLimiter = require('../middlewares/authRateLimitMiddleware');

router.post('/login', authLimiter, authController.login);
router.post('/signup', authLimiter, authController.signup);
```

---

## 2. SECURITY HEADERS

**File:** `server/middlewares/securityHeadersMiddleware.js` (NEW FILE)

```javascript
/**
 * Security Headers Middleware
 * Adds important security headers to responses
 */

const helmet = require('helmet');

module.exports = [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'http://localhost:5000']
    }
  }),
  helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }),
  helmet.hsts({ maxAge: 31536000, includeSubDomains: true }),
  helmet.noSniff(),
  helmet.xssFilter(),
  helmet.frameguard({ action: 'deny' })
];
```

**Update** `server/app.js`:
```javascript
const securityHeaders = require('./middlewares/securityHeadersMiddleware');
securityHeaders.forEach(middleware => app.use(middleware));
```

---

## 3. IMPROVED ERROR LOGGING

**File:** `server/config/logger.js` (NEW FILE)

```javascript
/**
 * Logger Configuration
 * Handles file and console logging
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor(filename) {
    this.filename = filename;
    this.logPath = path.join(logsDir, filename);
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };

    const logString = JSON.stringify(logEntry);

    // Console log
    const colors = {
      ERROR: '\x1b[31m',   // Red
      WARN: '\x1b[33m',    // Yellow
      INFO: '\x1b[36m',    // Cyan
      DEBUG: '\x1b[35m'    // Magenta
    };
    const resetColor = '\x1b[0m';

    console.log(`${colors[level] || ''}[${level}] ${message}${resetColor}`, data);

    // File log
    fs.appendFileSync(this.logPath, logString + '\n');
  }

  error(message, error) {
    this.log('ERROR', message, {
      error: error?.message,
      stack: error?.stack,
      code: error?.code
    });
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }
}

module.exports = new Logger('application.log');
```

**Usage throughout app:**
```javascript
const logger = require('../config/logger');

// In controllers
exports.makePayment = async (req, res) => {
  try {
    logger.info('Payment initiated', { loanId: req.body.loanId });
    // ... payment logic ...
    logger.info('Payment successful', { paymentId: result.id });
  } catch (err) {
    logger.error('Payment failed', err);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};
```

---

## 4. REQUEST ID / CORRELATION TRACKING

**File:** `server/middlewares/requestIdMiddleware.js` (NEW FILE)

```javascript
/**
 * Request ID Middleware
 * Adds unique ID to each request for distributed tracing
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // Generate or use existing request ID
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;

  // Add to response headers
  res.setHeader('X-Request-ID', requestId);

  // Log with request ID
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`[${requestId}] ${req.method} ${req.path} - ${res.statusCode}`);
    return originalJson.call(this, data);
  };

  next();
};
```

**Update** `server/app.js`:
```javascript
const requestIdMiddleware = require('./middlewares/requestIdMiddleware');
app.use(requestIdMiddleware);
```

---

## 5. REFACTOR ARCHITECTURE - ADD SERVICE LAYER

**Current Structure:**
```
server/
├── controllers/
├── models/
└── routes/
```

**Improved Structure:**
```
server/
├── controllers/      # Handle HTTP requests/responses
├── services/        # Business logic (NEW)
├── models/          # Database queries
├── middlewares/
└── routes/
```

**Example:** Extract Payment Logic to Service

**File:** `server/services/paymentService.js` (NEW FILE)

```javascript
/**
 * Payment Service
 * Contains all business logic for payments
 */

const paymentModel = require('../models/paymentModel');
const loanModel = require('../models/loanModel');
const logger = require('../config/logger');

class PaymentService {
  async makePayment(loanId, amount, method, userId) {
    try {
      logger.info('Payment service: Processing payment', { loanId, amount, method });

      // Validate loan exists
      const loan = await loanModel.getLoanById(loanId);
      if (!loan) {
        throw new Error('Loan not found');
      }

      // Validate loan is active
      if (loan.loanStatus !== 'ACTIVE') {
        throw new Error(`Cannot pay on ${loan.loanStatus} loan`);
      }

      // Validate amount doesn't exceed remaining balance
      if (amount > loan.remainingBalance) {
        throw new Error(
          `Payment exceeds remaining balance of ₹${loan.remainingBalance}`
        );
      }

      // Calculate next payment due date
      const nextDueDate = this.calculateNextDueDate(loan);

      // Process payment (transactional)
      const payment = await paymentModel.makePayment(
        loanId,
        amount,
        method,
        nextDueDate
      );

      logger.info('Payment successful', { 
        paymentId: payment.id, 
        loanId, 
        amount,
        userId 
      });

      return payment;

    } catch (err) {
      logger.error('Payment service error', err);
      throw err;
    }
  }

  calculateNextDueDate(loan) {
    const lastPaymentDate = new Date(loan.lastPaymentDate || loan.applicationDate);
    const nextDue = new Date(lastPaymentDate);
    nextDue.setMonth(nextDue.getMonth() + 1);
    return nextDue;
  }

  async deletePayment(paymentId, userId) {
    try {
      logger.info('Payment service: Deleting payment', { paymentId, userId });
      await paymentModel.deletePaymentById(paymentId);
      logger.info('Payment deleted', { paymentId, userId });
    } catch (err) {
      logger.error('Delete payment error', err);
      throw err;
    }
  }
}

module.exports = new PaymentService();
```

**Refactored Controller:**
```javascript
// server/controllers/paymentController.js
const paymentService = require('../services/paymentService');

exports.makePayment = async (req, res) => {
  try {
    const result = await paymentService.makePayment(
      req.body.loanId,
      req.body.amount,
      req.body.method,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      payment: result
    });

  } catch (err) {
    res.status(err.message.includes('not found') ? 404 : 400).json({
      success: false,
      message: err.message
    });
  }
};
```

---

## 6. ADD TYPESCRIPT FOR TYPE SAFETY

**File:** `server/types/index.ts` (NEW FILE)

```typescript
/**
 * TypeScript Type Definitions
 */

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
}

export interface Customer {
  id: number;
  customer_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileStatus: 'Active' | 'Inactive' | 'Suspended';
  employmentStatus: 'Employed' | 'Self-employed' | 'Unemployed';
  monthlyIncome: number;
  annualIncome: number;
  creditScore: number;
  created_at: Date;
}

export interface Loan {
  id: number;
  customer_id: string;
  loanAmount: number;
  appliedAmount: number;
  approvedAmount: number;
  tenure: number;
  annualRate: number;
  loanStatus: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  applicationDate: Date;
  approvalDate: Date;
  disbursementDate: Date;
  remainingBalance: number;
  lastPaymentDate: Date;
}

export interface Payment {
  id: number;
  loan_id: number;
  amount_paid: number;
  payment_date: Date;
  payment_method: 'CASH' | 'CHECK' | 'TRANSFER' | 'CARD' | 'ONLINE';
  next_due_date: Date;
  created_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
```

---

## 7. IMPROVED VALIDATION MIDDLEWARE

**File:** `server/middlewares/validateRequest.js`

```javascript
/**
 * Request Validation Middleware
 * Centralized validation for all request types
 */

const { body, param, query, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  validateRequest,
  // Reusable validators
  validateLoanId: param('loanId')
    .isInt({ min: 1 })
    .withMessage('Loan ID must be a positive integer'),

  validatePaymentAmount: body('amount')
    .isFloat({ min: 0.01, max: 999999999 })
    .withMessage('Amount must be between 0.01 and 999,999,999'),

  validateEmail: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),

  validatePassword: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  validatePagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be 1-500')
  ]
};
```

---

## 8. TESTING SETUP

**File:** `jest.config.js` (NEW FILE)

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/**/index.js',
    '!server/server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'json'],
  verbose: true
};
```

**Example Test File:** `server/__tests__/services/paymentService.test.js`

```javascript
const paymentService = require('../../services/paymentService');
const paymentModel = require('../../models/paymentModel');
const loanModel = require('../../models/loanModel');

jest.mock('../../models/paymentModel');
jest.mock('../../models/loanModel');

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('makePayment', () => {
    it('should process payment successfully', async () => {
      const mockLoan = {
        id: 1,
        loanStatus: 'ACTIVE',
        remainingBalance: 100000
      };

      loanModel.getLoanById.mockResolvedValue(mockLoan);
      paymentModel.makePayment.mockResolvedValue({
        id: 1,
        loan_id: 1,
        amount_paid: 10000
      });

      const result = await paymentService.makePayment(1, 10000, 'TRANSFER', 1);

      expect(result.id).toBe(1);
      expect(loanModel.getLoanById).toHaveBeenCalledWith(1);
      expect(paymentModel.makePayment).toHaveBeenCalled();
    });

    it('should throw error if loan not found', async () => {
      loanModel.getLoanById.mockResolvedValue(null);

      await expect(
        paymentService.makePayment(999, 10000, 'TRANSFER', 1)
      ).rejects.toThrow('Loan not found');
    });

    it('should throw error if amount exceeds remaining balance', async () => {
      const mockLoan = {
        id: 1,
        loanStatus: 'ACTIVE',
        remainingBalance: 5000
      };

      loanModel.getLoanById.mockResolvedValue(mockLoan);

      await expect(
        paymentService.makePayment(1, 10000, 'TRANSFER', 1)
      ).rejects.toThrow('Payment exceeds remaining balance');
    });
  });
});
```

---

## SUMMARY OF ALL RECOMMENDED CHANGES

| File | Type | Purpose |
|------|------|---------|
| `server/config/auth.js` | New | JWT secret validation |
| `server/config/env.js` | New | Environment variable validation |
| `server/config/logger.js` | New | File-based logging |
| `server/utils/passwordValidator.js` | New | Password strength checking |
| `server/utils/tokenManager.js` | New | JWT/cookie management |
| `server/middlewares/authRateLimitMiddleware.js` | New | Auth endpoint rate limiting |
| `server/middlewares/securityHeadersMiddleware.js` | New | Security headers |
| `server/middlewares/requestIdMiddleware.js` | New | Request correlation tracking |
| `server/middlewares/validateRequest.js` | New | Centralized validation |
| `server/services/paymentService.js` | New | Business logic layer |
| `server/types/index.ts` | New | TypeScript types |
| `jest.config.js` | New | Testing configuration |
| Various controller/middleware files | Update | Use new security/logging |

**Estimated Implementation Time:** 25-30 hours

**Impact:** 
- ✅ Security score: 45 → 85/100
- ✅ Code quality: 65 → 85/100
- ✅ Test coverage: 0 → 70%+
- ✅ Production readiness: 35 → 75/100

---

**See:** `APPLICATION_ANALYSIS_REPORT.md` for complete details on all issues and recommendations.
