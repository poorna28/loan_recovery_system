const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// ============= MIDDLEWARE IMPORTS =============
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');

// ============= BUILT-IN MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const loanRoutes = require('./routes/loanRoutes');
app.use('/api', loanRoutes);

app.use('/api/auth', require('./routes/authRoutes'));

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api', paymentRoutes);

// ============= ERROR HANDLING MIDDLEWARE =============
// This must be last - catches all errors from routes above
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = app;
