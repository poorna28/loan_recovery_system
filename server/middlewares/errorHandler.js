/**
 * Global Error Handling Middleware
 * Catches all errors and sends standardized responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = process.env.NODE_ENV === 'development' ? err.stack : null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || Object.values(err.errors).map(e => e.message);
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized - Invalid or missing token';
  }

  if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden - Access denied';
  }

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry - This record already exists';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW') {
    statusCode = 400;
    message = 'Invalid reference - Related record not found';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(details && { details })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
