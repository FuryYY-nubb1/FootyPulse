const app = require('./src/app');
const config = require('./src/config/env');
const db = require('./src/config/db');

const PORT = config.port;

// Ping the DB every 4 minutes to prevent Neon from suspending
const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000;

const startKeepAlive = () => {
  setInterval(async () => {
    try {
      await db.query('SELECT 1');
      console.log('DB keep-alive ping OK');
    } catch (err) {
      console.warn('DB keep-alive failed:', err.message);
    }
  }, KEEP_ALIVE_INTERVAL);
};

const startServer = async () => {
  // Test database connection before starting
  await db.testConnection();

  app.listen(PORT, () => {
    console.log('');
    console.log(` API running on port http://localhost:${PORT}`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log('');
  });

  // Start keep-alive after server is up
  startKeepAlive();
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
