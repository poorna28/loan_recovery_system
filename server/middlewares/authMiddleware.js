/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Attach user info to request
    req.user = decoded;
    req.userId = decoded.id || decoded.userId;

    console.log('✅ User authenticated:', req.userId);
    next();

  } catch (err) {
    console.error('❌ Auth error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Access denied.'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
