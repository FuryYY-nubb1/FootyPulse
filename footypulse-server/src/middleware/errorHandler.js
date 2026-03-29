

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
