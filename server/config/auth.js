/**
 * Authentication Configuration
 * Manages JWT secret and validates authentication environment variables
 */

const validateAuthConfig = () => {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error(
      '❌ CRITICAL: JWT_SECRET environment variable is not set. This is required for authentication security.'
    );
  }

  if (JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET is less than 32 characters. Increase secret length for better security.');
  }

  console.log('✅ Authentication config validated successfully');
};

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1h',
  validateAuthConfig
};
