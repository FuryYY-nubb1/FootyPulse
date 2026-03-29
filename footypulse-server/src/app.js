
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./config/cors');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();


app.use(helmet());


app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use(logger);


const isDev = process.env.NODE_ENV === 'development';
app.use('/api', rateLimiter(isDev ? 2000 : 200, 15 * 60 * 1000));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FootyPulse API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});


app.use('/api/v1', routes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;
