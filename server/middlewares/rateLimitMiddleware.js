/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP address
 */

const rateLimit = {};

const rateLimitMiddleware = (maxRequests = 100, timeWindow = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Initialize IP entry if not exists
    if (!rateLimit[ip]) {
      rateLimit[ip] = {
        requests: [],
        firstRequest: now
      };
    }

    const userdata = rateLimit[ip];

    // Remove old requests outside time window
    userdata.requests = userdata.requests.filter(
      timestamp => now - timestamp < timeWindow
    );

    // Check if limit exceeded
    if (userdata.requests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(timeWindow / 1000)
      });
    }

    // Add current request
    userdata.requests.push(now);

    // Add rate limit info to response headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - userdata.requests.length);

    next();
  };
};

/**
 * Cleanup old entries from rateLimit object periodically
 * Runs every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  const timeWindow = 15 * 60 * 1000;

  Object.keys(rateLimit).forEach(ip => {
    if (now - rateLimit[ip].firstRequest > timeWindow) {
      delete rateLimit[ip];
    }
  });
}, 5 * 60 * 1000);

module.exports = rateLimitMiddleware;
