/**
 * Security Headers Middleware
 * Adds essential security headers to all responses
 */

const helmet = require('helmet');

const securityHeaders = [
  // Content Security Policy - prevents XSS attacks
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://loan-recovery-system-7vv5.onrender.com'],

      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"]
    }
  }),

  // X-Frame-Options - prevents clickjacking
  helmet.frameguard({ action: 'deny' }),

  // X-Content-Type-Options - prevents MIME type sniffing
  helmet.noSniff(),

  // X-XSS-Protection - enables XSS filter in older browsers
  helmet.xssFilter(),

  // Strict-Transport-Security - enforces HTTPS
  helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }),

  // Referrer-Policy - controls referrer information
  helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }),

  // Permissions-Policy (Feature-Policy) - controls browser features
  helmet.permittedCrossDomainPolicies()
];

module.exports = securityHeaders;
