const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Settings routes - Auth is optional for development
// In production, uncomment the line below and remove the optional check in controller
// router.use(authMiddleware);

// ===== COMPANY PROFILE ROUTES =====
router.get('/company-profile',  authMiddleware, authorizeRoles('Admin', 'Manager'), settingsController.getCompanyProfile);
router.put('/company-profile',  authMiddleware, authorizeRoles('Admin'), settingsController.updateCompanyProfile);

// ===== INTEREST RATES ROUTES =====
router.get('/interest-rates',  authMiddleware, authorizeRoles('Admin', 'Manager'), settingsController.getInterestRates);
router.put('/interest-rates',  authMiddleware, authorizeRoles('Admin'), settingsController.updateInterestRates);

// ===== LOAN CONFIGURATION ROUTES =====
router.get('/loan-config',  authMiddleware, authorizeRoles('Admin', 'Manager'), settingsController.getLoanConfig);
router.put('/loan-config',  authMiddleware, authorizeRoles('Admin'), settingsController.updateLoanConfig);

// ===== PAYMENT METHODS & RULES ROUTES =====
router.get('/payment-methods',  authMiddleware, authorizeRoles('Admin', 'Manager'), settingsController.getPaymentMethods);
router.put('/payment-methods',  authMiddleware, authorizeRoles('Admin'), settingsController.updatePaymentMethods);

// ===== NOTIFICATIONS ROUTES =====
router.get('/notifications',  authMiddleware, authorizeRoles('Admin'), settingsController.getNotifications);
router.put('/notifications',  authMiddleware, authorizeRoles('Admin'), settingsController.updateNotifications);

// ===== USER MANAGEMENT ROUTES =====
router.get('/users',  authMiddleware, authorizeRoles('Admin'), settingsController.getUsers);
router.get('/users/:userId/roles',    authMiddleware, authorizeRoles('Admin'), settingsController.getUserroles);
router.put('/users/:userId/roles',  authMiddleware, authorizeRoles('Admin'), settingsController.updateUserRoles);
router.delete('/users/:userId',  authMiddleware, authorizeRoles('Admin'), settingsController.deleteUser);

// ===== ROLES ROUTES =====
router.get('/roles',  authMiddleware, authorizeRoles('Admin'), settingsController.getRoles);

// ===== SYSTEM OPERATIONS ROUTES =====
router.post('/reset',  authMiddleware, authorizeRoles('Admin'), settingsController.resetSettings);
router.get('/audit-log',  authMiddleware, authorizeRoles('Admin'), settingsController.getAuditLog);

module.exports = router;
