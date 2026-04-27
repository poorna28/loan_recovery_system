const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Validate environment variables first
const { validateEnvironment } = require('./config/env');
validateEnvironment();

// Validate authentication config
const authConfig = require('./config/auth');
authConfig.validateAuthConfig();

// Get logger
const logger = require('./config/logger');

const app = require('./app');
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('All payment routes loaded');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});