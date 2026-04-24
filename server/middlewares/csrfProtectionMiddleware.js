/**
 * CSRF Protection Middleware
 * Implements CSRF token generation and validation
 */

const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Configure CSRF protection with cookie-based tokens
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  }
});

module.exports = {
  // Middleware to set up CSRF token
  csrfProtection,

  // Middleware to parse cookies for CSRF
  csrfCookieParser: cookieParser(),

  // Error handler for CSRF validation failures
  csrfErrorHandler: (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      // Handle CSRF token errors
      res.status(403).json({
        success: false,
        message: 'Invalid CSRF token',
        error: 'CSRF token validation failed'
      });
    } else {
      next(err);
    }
  }
};
