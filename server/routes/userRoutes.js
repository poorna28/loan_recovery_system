const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ============= USER ROUTES =============

// GET all users with their roles
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

module.exports = router;
