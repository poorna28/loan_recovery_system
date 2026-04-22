const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Settings routes - Auth is optional for development
// In production, uncomment the line below and remove the optional check in controller
// router.use(authMiddleware);

// ===== COMPANY PROFILE ROUTES =====
router.get('/company-profile', settingsController.getCompanyProfile);
router.put('/company-profile', settingsController.updateCompanyProfile);

// ===== INTEREST RATES ROUTES =====
router.get('/interest-rates', settingsController.getInterestRates);
router.put('/interest-rates', settingsController.updateInterestRates);

// ===== LOAN CONFIGURATION ROUTES =====
router.get('/loan-config', settingsController.getLoanConfig);
router.put('/loan-config', settingsController.updateLoanConfig);

// ===== PAYMENT METHODS & RULES ROUTES =====
router.get('/payment-methods', settingsController.getPaymentMethods);
router.put('/payment-methods', settingsController.updatePaymentMethods);

// ===== NOTIFICATIONS ROUTES =====
router.get('/notifications', settingsController.getNotifications);
router.put('/notifications', settingsController.updateNotifications);

// ===== USER MANAGEMENT ROUTES =====
router.get('/users', settingsController.getUsers);
router.get('/users/:userId/roles', settingsController.getUserroles);
router.put('/users/:userId/roles', settingsController.updateUserRoles);
router.delete('/users/:userId', settingsController.deleteUser);

// ===== ROLES ROUTES =====
router.get('/roles', settingsController.getRoles);

// ===== SYSTEM OPERATIONS ROUTES =====
router.post('/reset', settingsController.resetSettings);
router.get('/audit-log', settingsController.getAuditLog);

module.exports = router;
