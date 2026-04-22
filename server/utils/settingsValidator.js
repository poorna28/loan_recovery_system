// ===== COMPANY PROFILE VALIDATOR =====
const validateCompanyProfile = (data) => {
  const errors = [];

  if (!data.company_name || data.company_name.trim().length === 0) {
    errors.push('Company name is required');
  } else if (data.company_name.length > 255) {
    errors.push('Company name must not exceed 255 characters');
  }

  if (data.registration_number && data.registration_number.length > 100) {
    errors.push('Registration number must not exceed 100 characters');
  }

  if (data.gstin && data.gstin.length > 15) {
    errors.push('GSTIN must not exceed 15 characters');
  }

  if (data.support_phone && data.support_phone.length > 20) {
    errors.push('Support phone must not exceed 20 characters');
  }

  if (data.address && data.address.length > 5000) {
    errors.push('Address must not exceed 5000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== INTEREST RATES VALIDATOR =====
const validateInterestRates = (data) => {
  const errors = [];

  const validateRate = (rate, fieldName) => {
    if (rate === undefined || rate === null) {
      errors.push(`${fieldName} is required`);
      return false;
    }
    const rateNum = parseFloat(rate);
    if (isNaN(rateNum)) {
      errors.push(`${fieldName} must be a number`);
      return false;
    }
    if (rateNum < 0 || rateNum > 100) {
      errors.push(`${fieldName} must be between 0 and 100`);
      return false;
    }
    return true;
  };

  validateRate(data.default_rate, 'Default rate');
  validateRate(data.personal_rate, 'Personal rate');
  validateRate(data.business_rate, 'Business rate');
  validateRate(data.gold_rate, 'Gold rate');

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== LOAN CONFIGURATION VALIDATOR =====
const validateLoanConfig = (data) => {
  const errors = [];

  const validateInt = (value, fieldName, min = 0, max = Infinity) => {
    if (value === undefined || value === null) {
      errors.push(`${fieldName} is required`);
      return false;
    }
    const intVal = parseInt(value);
    if (isNaN(intVal)) {
      errors.push(`${fieldName} must be an integer`);
      return false;
    }
    if (intVal < min || intVal > max) {
      errors.push(`${fieldName} must be between ${min} and ${max}`);
      return false;
    }
    return true;
  };

  const validateDecimal = (value, fieldName, min = 0, max = Infinity) => {
    if (value === undefined || value === null) {
      errors.push(`${fieldName} is required`);
      return false;
    }
    const decVal = parseFloat(value);
    if (isNaN(decVal)) {
      errors.push(`${fieldName} must be a number`);
      return false;
    }
    if (decVal < min || decVal > max) {
      errors.push(`${fieldName} must be between ${min} and ${max}`);
      return false;
    }
    return true;
  };

  // Validate tenure
  const minTenure = parseInt(data.min_tenure);
  const maxTenure = parseInt(data.max_tenure);
  const defaultTenure = parseInt(data.default_tenure);

  validateInt(data.min_tenure, 'Minimum tenure', 1, 360);
  validateInt(data.max_tenure, 'Maximum tenure', 1, 360);
  validateInt(data.default_tenure, 'Default tenure', 1, 360);

  if (!isNaN(minTenure) && !isNaN(maxTenure) && minTenure > maxTenure) {
    errors.push('Minimum tenure must be less than or equal to maximum tenure');
  }

  if (!isNaN(minTenure) && !isNaN(defaultTenure) && (defaultTenure < minTenure || defaultTenure > maxTenure)) {
    errors.push('Default tenure must be between minimum and maximum tenure');
  }

  // Validate amount
  const minAmount = parseFloat(data.min_amount);
  const maxAmount = parseFloat(data.max_amount);

  validateDecimal(data.min_amount, 'Minimum amount', 0, 99999999);
  validateDecimal(data.max_amount, 'Maximum amount', 0, 99999999);

  if (!isNaN(minAmount) && !isNaN(maxAmount) && minAmount > maxAmount) {
    errors.push('Minimum amount must be less than or equal to maximum amount');
  }

  // Validate EMI method
  if (!data.emi_method || data.emi_method.trim().length === 0) {
    errors.push('EMI method is required');
  } else if (!['Reducing Balance', 'Flat Rate', 'Simple Interest'].includes(data.emi_method)) {
    errors.push('EMI method must be Reducing Balance, Flat Rate, or Simple Interest');
  }

  // Validate penalties
  validateDecimal(data.late_fee, 'Late fee', 0, 999999);
  validateDecimal(data.penalty_rate, 'Penalty rate', 0, 100);

  // Validate grace period
  validateInt(data.grace_period, 'Grace period', 0, 180);

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== PAYMENT RULES VALIDATOR =====
const validatePaymentRules = (data) => {
  const errors = [];

  // Helper to check if value is a valid boolean (true/false/1/0)
  const isBooleanValue = (value) => {
    return typeof value === 'boolean' || value === 0 || value === 1 || value === '0' || value === '1';
  };

  if (!isBooleanValue(data.auto_receipt)) {
    errors.push('auto_receipt must be a boolean');
  }

  if (!isBooleanValue(data.allow_partial)) {
    errors.push('allow_partial must be a boolean');
  }

  if (!isBooleanValue(data.allow_advance)) {
    errors.push('allow_advance must be a boolean');
  }

  if (!isBooleanValue(data.round_off)) {
    errors.push('round_off must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== NOTIFICATIONS VALIDATOR =====
const validateNotifications = (data) => {
  const errors = [];

  // Helper to check if value is a valid boolean (true/false/1/0)
  const isBooleanValue = (value) => {
    return typeof value === 'boolean' || value === 0 || value === 1 || value === '0' || value === '1';
  };

  // Validate booleans
  if (!isBooleanValue(data.payment_confirmation)) {
    errors.push('payment_confirmation must be a boolean');
  }

  if (!isBooleanValue(data.emi_reminder)) {
    errors.push('emi_reminder must be a boolean');
  }

  if (!isBooleanValue(data.overdue_alert)) {
    errors.push('overdue_alert must be a boolean');
  }

  if (!isBooleanValue(data.loan_closure)) {
    errors.push('loan_closure must be a boolean');
  }

  // Validate SMS settings
  if (data.sms_provider && data.sms_provider.length > 100) {
    errors.push('SMS provider must not exceed 100 characters');
  }

  if (data.sms_sender_id && data.sms_sender_id.length > 20) {
    errors.push('SMS sender ID must not exceed 20 characters');
  }

  // Validate SMTP settings (if provided)
  if (data.smtp_host && data.smtp_host.length > 255) {
    errors.push('SMTP host must not exceed 255 characters');
  }

  if (data.smtp_port) {
    const port = parseInt(data.smtp_port);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('SMTP port must be a valid port number (1-65535)');
    }
  }

  if (data.smtp_username && data.smtp_username.length > 255) {
    errors.push('SMTP username must not exceed 255 characters');
  }

  if (data.smtp_from && data.smtp_from.length > 255) {
    errors.push('SMTP from address must not exceed 255 characters');
  } else if (data.smtp_from && !isValidEmail(data.smtp_from)) {
    errors.push('SMTP from address must be a valid email');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== UTILITY FUNCTIONS =====
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateCompanyProfile,
  validateInterestRates,
  validateLoanConfig,
  validatePaymentRules,
  validateNotifications
};
