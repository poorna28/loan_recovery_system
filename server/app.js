const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

// ============= MIDDLEWARE IMPORTS =============
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');
const requestIdMiddleware = require('./middlewares/requestIdMiddleware');
const securityHeaders = require('./middlewares/securityHeadersMiddleware');
const { csrfCookieParser, csrfProtection, csrfErrorHandler } = require('./middlewares/csrfProtectionMiddleware');

// ============= BUILT-IN MIDDLEWARE =============
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://loan-recovery-system.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============= REQUEST ID MIDDLEWARE =============
// Add this first to track requests
app.use(requestIdMiddleware);

// ============= SECURITY MIDDLEWARE =============
// Apply security headers
securityHeaders.forEach(middleware => app.use(middleware));

// CSRF cookie parser (must be before CSRF protection)
app.use(csrfCookieParser);

// ============= CUSTOM MIDDLEWARE =============
// Logging middleware (logs all requests)
app.use(loggingMiddleware);

// Rate limiting middleware (100 requests per 15 minutes)
app.use(rateLimitMiddleware(100, 15 * 60 * 1000));

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// ============= ROUTES =============
const customerRoutes = require('./routes/customerRoutes');
app.use('/api', customerRoutes);

// ===================

app.get('/', (req, res) => {
  res.send('Loan Recovery System API is running');
});


// ===================
const loanRoutes = require('./routes/loanRoutes');
app.use('/api', loanRoutes);

app.use('/api/auth', require('./routes/authRoutes'));

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api', paymentRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// const reportRoutes = require('./routes/reportroutes');
// app.use('/api/reports', reportRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// ============= ERROR HANDLING MIDDLEWARE =============
// CSRF error handler
app.use(csrfErrorHandler);

// Global error handler (must be last)
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = app;
