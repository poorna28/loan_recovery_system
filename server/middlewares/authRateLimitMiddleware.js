<<<<<<< HEAD
/**
 * Auth Rate Limiting Middleware
 * Implements strict rate limiting for authentication endpoints
 * Limits: 5 attempts per 15 minutes per IP
 */

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
=======
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,

>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
<<<<<<< HEAD
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use IP address as the key
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  },
=======

  standardHeaders: true,
  legacyHeaders: false,

  // ✅ FIXED HERE
  keyGenerator: (req) => ipKeyGenerator(req),

>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  },
<<<<<<< HEAD
  skip: (req) => {
    // Don't rate limit if in test environment
=======

  skip: (req) => {
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
    return process.env.NODE_ENV === 'testing';
  }
});

<<<<<<< HEAD
module.exports = authLimiter;
=======
module.exports = authLimiter;
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
