const db = require('./db');

// ===== COMPANY PROFILE =====
const getCompanyProfile = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_company LIMIT 1';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results[0] || {});
    });
  });
};

const updateCompanyProfile = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE settings_company SET company_name = ?, registration_number = ?, gstin = ?, support_phone = ?, address = ?, updated_at = NOW() WHERE id = 1';
    db.query(sql, [data.company_name, data.registration_number, data.gstin, data.support_phone, data.address], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== INTEREST RATES =====
const getInterestRates = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_interest_rates LIMIT 1';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results[0] || {});
    });
  });
};

const updateInterestRates = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE settings_interest_rates SET default_rate = ?, personal_rate = ?, business_rate = ?, gold_rate = ?, updated_at = NOW() WHERE id = 1';
    db.query(sql, [data.default_rate, data.personal_rate, data.business_rate, data.gold_rate], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== LOAN CONFIGURATION =====
const getLoanConfig = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_loan_config LIMIT 1';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results[0] || {});
    });
  });
};

const updateLoanConfig = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE settings_loan_config SET 
      min_tenure = ?, max_tenure = ?, default_tenure = ?, 
      min_amount = ?, max_amount = ?, emi_method = ?, 
      late_fee = ?, penalty_rate = ?, grace_period = ?, updated_at = NOW() 
      WHERE id = 1`;
    db.query(sql, [
      data.min_tenure, data.max_tenure, data.default_tenure,
      data.min_amount, data.max_amount, data.emi_method,
      data.late_fee, data.penalty_rate, data.grace_period
    ], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== PAYMENT METHODS =====
const getPaymentMethods = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_payment_methods ORDER BY method_name';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results || []);
    });
  });
};

const updatePaymentMethod = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE settings_payment_methods SET is_enabled = ?, updated_at = NOW() WHERE id = ?';
    db.query(sql, [data.is_enabled, id], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== PAYMENT RULES =====
const getPaymentRules = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_payment_rules LIMIT 1';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results[0] || {});
    });
  });
};

const updatePaymentRules = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE settings_payment_rules SET auto_receipt = ?, allow_partial = ?, allow_advance = ?, round_off = ?, updated_at = NOW() WHERE id = 1';
    db.query(sql, [data.auto_receipt, data.allow_partial, data.allow_advance, data.round_off], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== NOTIFICATIONS =====
const getNotifications = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM settings_notifications LIMIT 1';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results[0] || {});
    });
  });
};

const updateNotifications = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE settings_notifications SET 
      payment_confirmation = ?, emi_reminder = ?, overdue_alert = ?, loan_closure = ?,
      sms_provider = ?, sms_sender_id = ?,
      smtp_host = ?, smtp_port = ?, smtp_username = ?, smtp_password = ?, smtp_from = ?,
      updated_at = NOW() WHERE id = 1`;
    db.query(sql, [
      data.payment_confirmation, data.emi_reminder, data.overdue_alert, data.loan_closure,
      data.sms_provider, data.sms_sender_id,
      data.smtp_host, data.smtp_port, data.smtp_username, data.smtp_password, data.smtp_from
    ], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== USER MANAGEMENT =====
const getAllUsers = (page = 1, limit = 10, search = '') => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let sql = `SELECT u.*, GROUP_CONCAT(r.role_name) as roles 
               FROM users u 
               LEFT JOIN user_roles ur ON u.user_id = ur.user_id 
               LEFT JOIN roles r ON ur.role_id = r.id`;
    
    if (search) {
      sql += ` WHERE u.user_id LIKE ? OR u.name LIKE ?`;
      sql += ` GROUP BY u.user_id ORDER BY u.created_at DESC LIMIT ?, ?`;
      db.query(sql, [`%${search}%`, `%${search}%`, offset, limit], (error, results) => {
        if (error) reject(error);
        else resolve(results || []);
      });
    } else {
      sql += ` GROUP BY u.user_id ORDER BY u.created_at DESC LIMIT ?, ?`;
      db.query(sql, [offset, limit], (error, results) => {
        if (error) reject(error);
        else resolve(results || []);
      });
    }
  });
};

const getUserCount = (search = '') => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT COUNT(*) as total FROM users';
    if (search) {
      sql += ` WHERE user_id LIKE ? OR name LIKE ?`;
      db.query(sql, [`%${search}%`, `%${search}%`], (error, results) => {
        if (error) reject(error);
        else resolve(results[0]?.total || 0);
      });
    } else {
      db.query(sql, (error, results) => {
        if (error) reject(error);
        else resolve(results[0]?.total || 0);
      });
    }
  });
};

const getUserRoles = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT r.id, r.role_name FROM roles r INNER JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?';
    db.query(sql, [userId], (error, results) => {
      if (error) reject(error);
      else resolve(results || []);
    });
  });
};

const updateUserRoles = (userId, roleIds) => {
  return new Promise((resolve, reject) => {
    // First delete existing roles
    const deleteSql = 'DELETE FROM user_roles WHERE user_id = ?';
    db.query(deleteSql, [userId], (error) => {
      if (error) {
        reject(error);
        return;
      }
      
      // Then insert new roles
      if (roleIds && roleIds.length > 0) {
        const insertSql = 'INSERT INTO user_roles (user_id, role_id) VALUES ?';
        const values = roleIds.map(roleId => [userId, roleId]);
        db.query(insertSql, [values], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      } else {
        resolve({ affectedRows: 0 });
      }
    });
  });
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql, [userId], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// ===== ROLES =====
const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM roles ORDER BY role_name';
    db.query(sql, (error, results) => {
      if (error) reject(error);
      else resolve(results || []);
    });
  });
};

const getRolePermissions = (roleId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.* FROM permissions p 
                 INNER JOIN role_permissions rp ON p.id = rp.permission_id 
                 WHERE rp.role_id = ?`;
    db.query(sql, [roleId], (error, results) => {
      if (error) reject(error);
      else resolve(results || []);
    });
  });
};

// ===== AUDIT LOGGING =====
const logSettingsChange = (userId, settingType, action, oldValue, newValue, ipAddress) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO settings_audit_log 
                 (user_id, setting_type, action, old_value, new_value, ip_address) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const oldVal = oldValue ? JSON.stringify(oldValue) : null;
    const newVal = newValue ? JSON.stringify(newValue) : null;
    db.query(sql, [userId, settingType, action, oldVal, newVal, ipAddress], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getAuditLog = (settingType, days = 30) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM settings_audit_log 
                 WHERE setting_type = ? AND changed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                 ORDER BY changed_at DESC`;
    db.query(sql, [settingType, days], (error, results) => {
      if (error) reject(error);
      else resolve(results || []);
    });
  });
};

// ===== SYSTEM OPERATIONS =====
const resetToDefaults = () => {
  return new Promise((resolve, reject) => {
    // Reset queries to execute sequentially
    const resetQueries = [
      'UPDATE settings_company SET company_name = "LoanPro Finance Pvt. Ltd.", registration_number = "CIN: U65929TG2020PTC142857", gstin = "36AABCL1234A1ZX", support_phone = "+91 98765 43210", address = "Plot 42, HITEC City, Hyderabad, Telangana - 500081" WHERE id = 1',
      'UPDATE settings_interest_rates SET default_rate = 18.00, personal_rate = 18.00, business_rate = 14.00, gold_rate = 12.00 WHERE id = 1',
      'UPDATE settings_loan_config SET min_tenure = 3, max_tenure = 60, default_tenure = 12, min_amount = 5000.00, max_amount = 1000000.00, emi_method = "Reducing Balance", late_fee = 200.00, penalty_rate = 2.00, grace_period = 3 WHERE id = 1',
      'UPDATE settings_payment_rules SET auto_receipt = TRUE, allow_partial = FALSE, allow_advance = TRUE, round_off = TRUE WHERE id = 1',
      'UPDATE settings_notifications SET payment_confirmation = TRUE, emi_reminder = TRUE, overdue_alert = TRUE, loan_closure = TRUE, sms_provider = "Twilio", sms_sender_id = "LOANPRO" WHERE id = 1'
    ];
    
    // Execute queries sequentially to avoid race conditions
    const executeSequentially = (index = 0) => {
      if (index >= resetQueries.length) {
        console.log('✅ All settings reset to defaults successfully');
        resolve({ success: true, message: 'Settings reset to defaults' });
        return;
      }
      
      const sql = resetQueries[index];
      console.log(`🔄 Executing reset query ${index + 1}/${resetQueries.length}...`);
      
      db.query(sql, (error, results) => {
        if (error) {
          console.error(`❌ Reset query ${index + 1} failed:`, error.message);
          reject(error);
        } else {
          console.log(`✅ Reset query ${index + 1} completed`);
          executeSequentially(index + 1);
        }
      });
    };
    
    executeSequentially();
  });
};

module.exports = {
  // Company Profile
  getCompanyProfile,
  updateCompanyProfile,
  
  // Interest Rates
  getInterestRates,
  updateInterestRates,
  
  // Loan Configuration
  getLoanConfig,
  updateLoanConfig,
  
  // Payment Methods
  getPaymentMethods,
  updatePaymentMethod,
  getPaymentRules,
  updatePaymentRules,
  
  // Notifications
  getNotifications,
  updateNotifications,
  
  // User Management
  getAllUsers,
  getUserCount,
  getUserRoles,
  updateUserRoles,
  deleteUser,
  
  // Roles
  getAllRoles,
  getRolePermissions,
  
  // Audit Logging
  logSettingsChange,
  getAuditLog,
  
  // System Operations
  resetToDefaults
};
