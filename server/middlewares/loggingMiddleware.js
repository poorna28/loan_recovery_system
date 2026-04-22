/**
 * HTTP Request Logging Middleware
 * Logs all incoming requests with method, URL, status, and response time
 */

const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  // Attach request ID
  req.id = requestId;

  // Log incoming request

  console.log(
    ` [${requestId}] ${req.method} ${req.path}`,
    req.query && Object.keys(req.query).length > 0 ? `| Query: ${JSON.stringify(req.query)}` : ''
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(` [${requestId}] Body:`, JSON.stringify(req.body));
  }

  // Intercept response
  const originalJson = res.json;

  res.json = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    console.log(
      `${statusEmoji} [${requestId}] ${req.method} ${req.path} → ${statusCode} | ${duration}ms`
    );

    if (statusCode >= 400) {
      console.log(` [${requestId}] Response:`, JSON.stringify(data));
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = loggingMiddleware;



//  Overall Logic Flow

// For each HTTP request:

// 1️⃣ Middleware starts timer
// 2️⃣ Generates request ID
// 3️⃣ Logs request details
// 4️⃣ Waits for controller to respond
// 5️⃣ Intercepts res.json()
// 6️⃣ Calculates duration
// 7️⃣ Logs status & timing
// 8️⃣ Sends response normally

// Request arrives
//     ↓
// loggingMiddleware runs
//     ↓
// Controller executes
//     ↓
// Controller calls res.json()
//     ↓
// Your wrapper logs response
//     ↓
// Original res.json sends data