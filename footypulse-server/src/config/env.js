// ============================================
// src/config/env.js
// ============================================
// PURPOSE: Loads and exports all environment variables from .env
// USED BY: Every file that needs env variables imports from here
//          instead of using process.env directly
// ============================================

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Neon DB uses a single connection string (not separate host/port/db)
  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
