
const { Pool } = require('@neondatabase/serverless');
const config = require('./env');


if (!config.databaseUrl) {
  console.error(' DATABASE_URL is not set in .env file!');
  console.error('   Get your connection string from https://console.neon.tech');
  process.exit(1);
}

const pool = new Pool({
  connectionString: config.databaseUrl,
});

// Test connection on startup
pool.on('error', (err) => {
  console.error(' Unexpected Neon DB error:', err);
  process.exit(-1);
});


const query = async (text, params) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  // Log slow queries in development
  if (config.nodeEnv === 'development' && duration > 100) {
    console.log(`  Slow query (${duration}ms):`, text);
  }

  return result;
};

const getClient = () => pool.connect();

// Test the connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(' Connected to Neon PostgreSQL at', result.rows[0].now);
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
