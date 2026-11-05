const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
<<<<<<< HEAD
const { authorizeRoles } = require('../middlewares/roleMiddleware');
=======
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

const router = express.Router();

// Settings routes - Auth is optional for development
// In production, uncomment the line below and remove the optional check in controller
// router.use(authMiddleware);

// ===== COMPANY PROFILE ROUTES =====
<<<<<<< HEAD
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
=======
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
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

module.exports = router;
