// ============================================
// src/middleware/auth.js
// ============================================
// PURPOSE: Protects routes that require authentication
// USED BY: Route files — added before controller for protected endpoints
//
// EXAMPLE in routes:
//   router.get('/countries', controller.getAll);           // Public
//   router.post('/countries', auth, controller.create);    // Protected
//   router.delete('/countries/:id', auth, admin, controller.remove); // Admin only
//
// HOW IT WORKS:
//   1. Client sends: Authorization: Bearer <token>
//   2. This middleware verifies the token
//   3. Attaches decoded user data to req.user
//   4. Calls next() to proceed to the controller
// ============================================

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided. Send: Authorization: Bearer <token>'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach user to request
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { user_id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token has expired'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
};

// Optional: Admin-only middleware (use after auth)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(ApiError.forbidden('Admin access required'));
};

module.exports = { auth, admin };
