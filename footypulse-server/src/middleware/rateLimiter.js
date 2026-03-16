// ============================================
// src/middleware/rateLimiter.js
// ============================================
// PURPOSE: Simple in-memory rate limiter (no Redis needed)
// USED BY: src/app.js or specific routes
//
// NOTE: For production with multiple server instances,
//       switch to redis-based rate limiting (e.g., express-rate-limit + rate-limit-redis)
// ============================================

const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  // Clean up expired entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests) {
      if (now - data.startTime > windowMs) {
        requests.delete(key);
      }
    }
  }, 60 * 1000);

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, { count: 1, startTime: now });
      return next();
    }

    const record = requests.get(key);

    // Reset window if expired
    if (now - record.startTime > windowMs) {
      requests.set(key, { count: 1, startTime: now });
      return next();
    }

    record.count++;

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
};

module.exports = rateLimiter;
