/**
 * Request ID Middleware
 * Generates unique request IDs for distributed tracing and logging
 */

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // Generate or use existing request ID
  const requestId = req.headers['x-request-id'] || uuidv4();

  // Attach request ID to request object
  req.id = requestId;

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);

  // Add request ID to logs
  req.requestId = requestId;

  // Log request with request ID
  console.log(`📥 [${requestId}] ${req.method} ${req.path}`);

  // Capture response time
  const startTime = Date.now();

  // Override res.end to log response with request ID
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Color code based on status
    let statusIndicator = '✅';
    if (statusCode >= 400 && statusCode < 500) statusIndicator = '⚠️ ';
    if (statusCode >= 500) statusIndicator = '❌';

    console.log(`📤 [${requestId}] ${req.method} ${req.path} - ${statusCode} (${duration}ms) ${statusIndicator}`);

    originalEnd.apply(res, args);
  };

  next();
};
