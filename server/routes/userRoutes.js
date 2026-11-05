const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
<<<<<<< HEAD
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
=======
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

// ============= USER ROUTES =============

// GET all users with their roles
<<<<<<< HEAD
router.get('/users', authMiddleware, authorizeRoles('Admin'), userController.getAllUsers);

// GET all available roles
router.get('/roles', authMiddleware, authorizeRoles('Admin'), userController.getAllRoles);

// GET single user by ID
router.get('/users/:id', authMiddleware, authorizeRoles('Admin'), userController.getUserById);

// POST create new user
router.post('/users', authMiddleware, authorizeRoles('Admin'), userController.createUser);

// PUT update user (status, details, role)
router.put('/users/:id', authMiddleware, authorizeRoles('Admin'), userController.updateUser);

// DELETE user by ID
router.delete('/users/:id', authMiddleware, authorizeRoles('Admin'), userController.deleteUser);
=======
router.get('/users', userController.getAllUsers);

// GET all available roles
router.get('/roles', userController.getAllRoles);

// GET single user by ID
router.get('/users/:id', userController.getUserById);

// POST create new user
router.post('/users', userController.createUser);

// PUT update user (status, details, role)
router.put('/users/:id', userController.updateUser);

// DELETE user by ID
router.delete('/users/:id', userController.deleteUser);
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391

module.exports = router;
