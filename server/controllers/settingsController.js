const settingsModel = require('../models/settingsModel');
const settingsValidator = require('../utils/settingsValidator');

// ===== COMPANY PROFILE CONTROLLER =====
exports.getCompanyProfile = async (req, res) => {
  try {
    const company = await settingsModel.getCompanyProfile();
    res.json({
      success: true,
      message: 'Company settings retrieved successfully',
      settings: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving company profile',
      error: error.message
    });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    // Validate input
    const validation = settingsValidator.validateCompanyProfile(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    // Get old values for audit log
    const oldValues = await settingsModel.getCompanyProfile();
    
    // Update settings
    await settingsModel.updateCompanyProfile(req.body);
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'COMPANY_PROFILE',
        'UPDATE',
        oldValues,
        req.body,
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      settings: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating company profile',
      error: error.message
    });
  }
};

// ===== INTEREST RATES CONTROLLER =====
exports.getInterestRates = async (req, res) => {
  try {
    const rates = await settingsModel.getInterestRates();
    res.json({
      success: true,
      message: 'Interest rates retrieved successfully',
      settings: rates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving interest rates',
      error: error.message
    });
  }
};

exports.updateInterestRates = async (req, res) => {
  try {
    // Validate input
    const validation = settingsValidator.validateInterestRates(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    // Get old values for audit log
    const oldValues = await settingsModel.getInterestRates();
    
    // Update settings
    await settingsModel.updateInterestRates(req.body);
    
    // Invalidate interest rates cache so next fetch uses fresh data
    const settingsCache = require('../utils/settingsCache');
    settingsCache.invalidateInterestRates();
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'INTEREST_RATES',
        'UPDATE',
        oldValues,
        req.body,
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'Interest rates updated successfully',
      settings: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating interest rates',
      error: error.message
    });
  }
};

// ===== LOAN CONFIGURATION CONTROLLER =====
exports.getLoanConfig = async (req, res) => {
  try {
    const config = await settingsModel.getLoanConfig();
    res.json({
      success: true,
      message: 'Loan configuration retrieved successfully',
      settings: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving loan configuration',
      error: error.message
    });
  }
};

exports.updateLoanConfig = async (req, res) => {
  try {
    // Validate input
    const validation = settingsValidator.validateLoanConfig(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    // Get old values for audit log
    const oldValues = await settingsModel.getLoanConfig();
    
    // Update settings
    await settingsModel.updateLoanConfig(req.body);
    
    // Invalidate cache so next validation uses fresh settings
    const settingsCache = require('../utils/settingsCache');
    settingsCache.invalidate();
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'LOAN_CONFIG',
        'UPDATE',
        oldValues,
        req.body,
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'Loan configuration updated successfully',
      settings: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating loan configuration',
      error: error.message
    });
  }
};

// ===== PAYMENT METHODS CONTROLLER =====
exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await settingsModel.getPaymentMethods();
    const rules = await settingsModel.getPaymentRules();
    res.json({
      success: true,
      message: 'Payment settings retrieved successfully',
      settings: {
        methods,
        rules
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving payment settings',
      error: error.message
    });
  }
};

exports.updatePaymentMethods = async (req, res) => {
  try {
    const { methods, rules } = req.body;
    
    // Update payment methods
    if (methods && Array.isArray(methods)) {
      for (const method of methods) {
        await settingsModel.updatePaymentMethod(method.id, { is_enabled: method.is_enabled });
      }
    }
    
    // Update payment rules
    if (rules) {
      const validation = settingsValidator.validatePaymentRules(rules);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.errors
        });
      }
      await settingsModel.updatePaymentRules(rules);
    }
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'PAYMENT_METHODS',
        'UPDATE',
        null,
        { methods, rules },
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      settings: { methods, rules }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment settings',
      error: error.message
    });
  }
};

// ===== NOTIFICATIONS CONTROLLER =====
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await settingsModel.getNotifications();
    res.json({
      success: true,
      message: 'Notification settings retrieved successfully',
      settings: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notification settings',
      error: error.message
    });
  }
};

exports.updateNotifications = async (req, res) => {
  try {
    // Validate input
    const validation = settingsValidator.validateNotifications(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    // Get old values for audit log
    const oldValues = await settingsModel.getNotifications();
    
    // Update settings
    await settingsModel.updateNotifications(req.body);
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'NOTIFICATIONS',
        'UPDATE',
        oldValues,
        req.body,
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification settings',
      error: error.message
    });
  }
};

// ===== USER MANAGEMENT CONTROLLER =====
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const users = await settingsModel.getAllUsers(page, limit, search);
    const total = await settingsModel.getUserCount(search);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

exports.getUserroles = async (req, res) => {
  try {
    const { userId } = req.params;
    const roles = await settingsModel.getUserRoles(userId);
    res.json({
      success: true,
      message: 'User roles retrieved successfully',
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user roles',
      error: error.message
    });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleIds } = req.body;

    // Validate input
    if (!Array.isArray(roleIds)) {
      return res.status(400).json({
        success: false,
        message: 'roleIds must be an array'
      });
    }

    // Get old roles for audit log
    const oldRoles = await settingsModel.getUserRoles(userId);
    
    // Update roles
    await settingsModel.updateUserRoles(userId, roleIds);
    
    // Log change (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'USER_ROLES',
        'UPDATE',
        oldRoles,
        { userId, roleIds },
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    res.json({
      success: true,
      message: 'User roles updated successfully',
      data: { userId, roleIds }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user roles',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Log deletion (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'USER_MANAGEMENT',
        'DELETE',
        { user_id: userId },
        null,
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    await settingsModel.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: { userId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// ===== ROLES CONTROLLER =====
exports.getRoles = async (req, res) => {
  try {
    const roles = await settingsModel.getAllRoles();
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => ({
        ...role,
        permissions: await settingsModel.getRolePermissions(role.id)
      }))
    );
    
    res.json({
      success: true,
      message: 'Roles retrieved successfully',
      data: rolesWithPermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving roles',
      error: error.message
    });
  }
};

// ===== SYSTEM OPERATIONS CONTROLLER =====
exports.resetSettings = async (req, res) => {
  try {
    // Log the reset operation (non-blocking - won't fail the request if it errors)
    const userIdFromToken = req.user?.user_id || 0;
    try {
      await settingsModel.logSettingsChange(
        userIdFromToken,
        'SYSTEM_OPERATIONS',
        'RESET',
        null,
        { operation: 'Reset all settings to defaults' },
        req.ip
      );
    } catch (auditError) {
      console.error('Audit log error:', auditError.message);
      // Continue anyway, audit logging is not critical
    }

    await settingsModel.resetToDefaults();
    
    // Invalidate settings cache so next fetch uses fresh defaults
    const settingsCache = require('../utils/settingsCache');
    settingsCache.invalidate();
    
    res.json({
      success: true,
      message: 'All settings have been reset to default values'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    const { settingType, days } = req.query;
    const log = await settingsModel.getAuditLog(settingType, days || 30);
    
    res.json({
      success: true,
      message: 'Audit log retrieved successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving audit log',
      error: error.message
    });
  }
};
