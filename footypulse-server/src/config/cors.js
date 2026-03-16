// ============================================
// src/config/cors.js
// ============================================
// PURPOSE: Configures which origins can access our API
// USED BY: src/app.js (applied as global middleware)
// ============================================

const config = require('./env');

const corsOptions = {
  origin: config.nodeEnv === 'production'
    ? config.clientUrl
    : ['http://localhost:5173', 'http://localhost:3000'], // Vite + CRA defaults
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
