// ============================================
// src/middleware/logger.js
// ============================================
// PURPOSE: HTTP request logging
// USED BY: src/app.js
// ============================================

const morgan = require('morgan');
const config = require('../config/env');

// 'dev' = colorful output: GET /api/v1/countries 200 12ms
// 'combined' = Apache-style logs for production
const logger = config.nodeEnv === 'development'
  ? morgan('dev')
  : morgan('combined');

module.exports = logger;
