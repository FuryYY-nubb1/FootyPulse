// ============================================
// src/middleware/errorHandler.js
// ============================================
// PURPOSE: Catches ALL errors thrown in the app and sends a clean JSON response
// USED BY: src/app.js — must be the LAST middleware registered
//
// HOW IT WORKS:
//   1. Controller throws an error (or asyncHandler catches one)
//   2. Express routes it here via next(err)
//   3. We check if it's an ApiError (operational) or unexpected
//   4. Send appropriate JSON response
// ============================================

const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  // Default to 500
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific Postgres errors
  if (err.code === '23505') {
    // Unique constraint violation
    statusCode = 409;
    message = 'A record with that value already exists';
  } else if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Referenced record does not exist';
  } else if (err.code === '23502') {
    // Not null violation
    statusCode = 400;
    message = `Missing required field: ${err.column}`;
  }

  // Log error
  console.error(`❌ [${statusCode}] ${message}`);
  if (config.nodeEnv === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      code: err.code,
    }),
  });
};

module.exports = errorHandler;
