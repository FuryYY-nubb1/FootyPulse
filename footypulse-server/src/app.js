// ============================================
// src/app.js
// ============================================
// PURPOSE: Creates and configures the Express application
// USED BY: server.js (imports this and starts listening)
//
// MIDDLEWARE ORDER MATTERS:
//   1. helmet()        → Security headers
//   2. cors()          → Cross-origin access
//   3. express.json()  → Parse JSON bodies
//   4. logger          → Log requests
//   5. rateLimiter     → Throttle abusive clients
//   6. routes          → Handle API requests
//   7. 404 handler     → Catch unmatched routes
//   8. errorHandler    → Catch all errors (MUST BE LAST)
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./config/cors');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ── 1. Security headers ──
app.use(helmet());

// ── 2. CORS ──
app.use(cors(corsOptions));

// ── 3. Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── 4. Request logging ──
app.use(logger);

// ── 5. Rate limiting ──
// Development: 2000 req / 15 min (plenty of headroom for hot-reload + polling)
// Production:  200  req / 15 min (reasonable for real users)
const isDev = process.env.NODE_ENV === 'development';
app.use('/api', rateLimiter(isDev ? 2000 : 200, 15 * 60 * 1000));

// ── 6. Health check (no auth needed) ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FootyPulse API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── 7. API routes ──
app.use('/api/v1', routes);

// ── 8. 404 handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── 9. Global error handler (MUST be last middleware) ──
app.use(errorHandler);

module.exports = app;
