/**
 * Token Management Utility
 * Handles JWT creation and secure cookie management
 */

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const createToken = (userId, userEmail, role = 'user') => {
  return jwt.sign(
    {
      id: userId,
      email: userEmail,
      role: role
    },
    authConfig.JWT_SECRET,
    { expiresIn: authConfig.JWT_EXPIRY }
  );
};

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('authToken', token, {
    httpOnly: true, // Prevent JavaScript from accessing the cookie
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'Strict', // CSRF protection
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/', // Available to all routes
    domain: undefined // Will use current domain
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/'
  });
};

const extractTokenFromRequest = (req) => {
  // Check for token in Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  if (req.cookies && req.cookies.authToken) {
    return req.cookies.authToken;
  }

  return null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createToken,
  setTokenCookie,
  clearTokenCookie,
  extractTokenFromRequest,
  verifyToken
};
