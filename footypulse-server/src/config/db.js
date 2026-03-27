// ============================================
// src/config/db.js
// ============================================
// PURPOSE: Creates and exports the Neon DB connection pool
// USED BY: All model files (countryModel.js, teamModel.js, etc.)
//
// HOW NEON WORKS:
//   - Neon provides serverless Postgres with a single connection string
//   - We use @neondatabase/serverless which is a drop-in replacement for 'pg'
//   - The Pool works exactly like pg.Pool but routes through Neon's proxy
//   - SSL is required (already in the connection string via ?sslmode=require)
//
// COLD START HANDLING:
//   - Neon free tier suspends after ~5 min of inactivity
//   - server.js runs a keep-alive ping every 4 min to prevent suspension
//   - query() has built-in retry logic for transient connection errors
// ============================================

const { Pool } = require('@neondatabase/serverless');
const config = require('./env');

// Validate that DATABASE_URL exists
if (!config.databaseUrl) {
  console.error('DATABASE_URL is not set in .env file!');
  console.error('   Get your connection string from https://console.neon.tech');
  process.exit(1);
}

const pool = new Pool({
  connectionString: config.databaseUrl,
});

// Handle unexpected pool-level errors
pool.on('error', (err) => {
  console.error('Unexpected Neon DB pool error:', err.message);
  // Don't exit — let the retry logic in query() handle it
});

// Helper: run a single query with retry on transient connection errors
// Usage: const { rows } = await db.query('SELECT * FROM countries WHERE code = $1', ['ENG']);
const query = async (text, params, retries = 2) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (config.nodeEnv === 'development' && duration > 100) {
      console.log(`Slow query (${duration}ms):`, text);
    }

    return result;
  } catch (err) {
    const isTransient =
      err.code === 'ECONNRESET' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'ETIMEDOUT' ||
      err.message?.includes('timeout') ||
      err.message?.includes('Connection terminated') ||
      err.message?.includes('server closed the connection');

    if (retries > 0 && isTransient) {
      console.warn(`DB query failed (${err.message}), retrying in 1s... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, 1000));
      return query(text, params, retries - 1);
    }

    throw err;
  }
};

// Helper: get a client for transactions
// Usage: const client = await db.getClient();
//        try { await client.query('BEGIN'); ... await client.query('COMMIT'); }
//        catch { await client.query('ROLLBACK'); throw e; }
//        finally { client.release(); }
const getClient = () => pool.connect();

// Test the connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connected to Neon PostgreSQL at', result.rows[0].now);
  } catch (err) {
    console.error('Failed to connect to Neon DB:', err.message);
    process.exit(1);
  }
};

module.exports = {
  query,
  getClient,
  testConnection,
  pool,
};
