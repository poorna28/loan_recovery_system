/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */

const tokenManager = require('../utils/tokenManager');

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from header or cookies
    const token = tokenManager.extractTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }

    // Verify token
    const decoded = tokenManager.verifyToken(token);

    // Attach user info to request
    req.user = decoded;
    req.userId = decoded.id || decoded.userId;
    
    console.log(`✅ User authenticated: ${req.userId} (Request ID: ${req.id})`);
    next();

  } catch (err) {
    console.error(`❌ Auth error: ${err.message} (Request ID: ${req.id})`);

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


//  Logic Flow (Simplified)

// When a request hits a protected route:

// 1️⃣ Read token from Authorization header
// 2️⃣ If missing → Respond 401 Unauthorized
// 3️⃣ Verify JWT using secret key
// 4️⃣ If invalid / expired → Respond 401
// 5️⃣ If valid → Extract payload
// 6️⃣ Attach user info to req
// 7️⃣ Call next() → Continue request


// Authorization header → Standard HTTP place to send credentials like tokens (Authorization: Bearer <token>).

// JWT → A signed token that safely carries user identity/data without storing sessions on the server.

// Secret key → Used by the server to verify the token is genuine and not tampered with


// Authorization header is used to send authentication credentials (like a JWT token) from the client to the server in a standard, secure way.