const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,

  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },

  standardHeaders: true,
  legacyHeaders: false,

  // ✅ FIXED HERE
  keyGenerator: (req) => ipKeyGenerator(req),

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  },

  skip: (req) => {
    return process.env.NODE_ENV === 'testing';
  }
});

module.exports = authLimiter;