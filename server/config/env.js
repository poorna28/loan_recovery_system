/**
 * Environment Configuration Validator
 * Validates all required environment variables on startup
 */

const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'NODE_ENV'
];

const OPTIONAL_ENV_VARS = {
  PORT: 5000,
  NODE_ENV: 'development',
  JWT_EXPIRY: '1h',
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000
};

const validateEnvironment = () => {
  const missing = [];
  const errors = [];

  // Check required environment variables
  REQUIRED_ENV_VARS.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  // Validate specific values
  if (process.env.NODE_ENV && !['development', 'production', 'testing'].includes(process.env.NODE_ENV)) {
    errors.push(`NODE_ENV must be one of: development, production, testing. Got: ${process.env.NODE_ENV}`);
  }

  if (process.env.DB_PORT && isNaN(process.env.DB_PORT)) {
    errors.push(`DB_PORT must be a number. Got: ${process.env.DB_PORT}`);
  }

  if (process.env.PORT && isNaN(process.env.PORT)) {
    errors.push(`PORT must be a number. Got: ${process.env.PORT}`);
  }

  // Report errors
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  if (errors.length > 0) {
    console.error('❌ Invalid environment variable values:');
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error('Invalid environment variables');
  }

  console.log('✅ All environment variables validated successfully');
};

module.exports = { validateEnvironment, REQUIRED_ENV_VARS, OPTIONAL_ENV_VARS };
