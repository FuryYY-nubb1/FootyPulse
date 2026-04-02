// ============================================
// src/middleware/auth.js
// ============================================
// UPDATED: Added `optionalAuth` middleware.
// - `auth`         → BLOCKS unauthenticated users (for write operations)
// - `optionalAuth` → CHECKS token if present, attaches req.user, but
//                     lets unauthenticated users through (for read operations)
//
// This satisfies: "check authentication on every page" — meaning
// we VERIFY the token on every request, but only REQUIRE it for
// protected actions (comments, votes, admin CRUD).
// ============================================

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');

// ─── Required auth: blocks if no valid token ───
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided. Send: Authorization: Bearer <token>'));
  }

  const token = authHeader.split(' ')[1];

  try {
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

// ─── Optional auth: checks token if present, passes through if not ───
// This is applied globally so that authentication is VALIDATED on every
// request, but unauthenticated users can still browse public content.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token present — that's fine, user is just browsing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // Attach verified user to request
    next();
  } catch (err) {
    // Token is present but invalid/expired — clear it, don't block
    req.user = null;
    next();
  }
};

// ─── Admin-only middleware (use after auth) ───
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(ApiError.forbidden('Admin access required'));
};

module.exports = { auth, optionalAuth, admin };