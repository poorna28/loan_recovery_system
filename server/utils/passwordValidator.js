/**
 * Password Strength Validator
 * Enforces strong password requirements
 */

const validatePasswordStrength = (password) => {
  const errors = [];

  // Check minimum length
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }

  // Check for special character
  if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#)');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', 'admin', '123456', 'qwerty', 'letmein', 'welcome'];
  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    errors.push('Password is too common. Choose a stronger password');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: calculateScore(password)
  };
};

const calculateScore = (password) => {
  let score = 0;

  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;
  if (!/^(.)\1{2,}/.test(password)) score += 10; // No repeating characters
  if (!/(.)(.)(.)/g.test(password.toLowerCase())) score += 10; // No sequential characters

  return Math.min(100, score);
};

module.exports = { validatePasswordStrength, calculateScore };
