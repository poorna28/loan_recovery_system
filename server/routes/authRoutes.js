const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authLimiter = require('../middlewares/authRateLimitMiddleware');

// Apply rate limiting to authentication endpoints
router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
