const app = require('./src/app');
const config = require('./src/config/env');
const db = require('./src/config/db');

const PORT = config.port;

const startServer = async () => {
  // Test database connection before starting
  await db.testConnection();

  app.listen(PORT, () => {
    console.log('');
    console.log(` API running on port http://localhost:${PORT}`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log('');
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
