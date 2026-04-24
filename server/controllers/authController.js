const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const tokenManager = require('../utils/tokenManager');
const { validatePasswordStrength } = require('../utils/passwordValidator');
const logger = require('../config/logger');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.valid) {
            logger.warn('Weak password attempted during signup', { email, errors: passwordValidation.errors });
            return res.status(400).json({
                success: false,
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors
            });
        }

        // Check if email already exists
        const [existing] = await userModel.findUserByEmail(email);
        if (existing.length) {
            logger.warn('Signup attempt with existing email', { email });
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Create user
        await userModel.createUser({ name, email, password });
        logger.info('New user registered successfully', { email, name });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (err) {
        logger.error('Signup error', { error: err.message, email: req.body?.email });
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const [user] = await userModel.findUserByEmail(email);
        if (!user.length) {
            logger.warn('Login attempt with non-existent email', { email });
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
            logger.warn('Login attempt with incorrect password', { email });
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Create token
        const token = tokenManager.createToken(user[0].id, user[0].email, user[0].role);

        // Set httpOnly cookie
        tokenManager.setTokenCookie(res, token);

        logger.info('User logged in successfully', { email, userId: user[0].id });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                role: user[0].role
            }
        });
    } catch (err) {
        logger.error('Login error', { error: err.message, email: req.body?.email });
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.logout = (req, res) => {
    try {
        tokenManager.clearTokenCookie(res);
        logger.info('User logged out', { userId: req.userId });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        logger.error('Logout error', { error: err.message });
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};



//  What a Controller Structurally Does

// A controller typically:

// 1️⃣ Reads data from request (req.body, req.params)
// 2️⃣ Calls model / services
// 3️⃣ Applies business rules
// 4️⃣ Sends HTTP response (res.json(), res.status())
// 5️⃣ Handles errors

// Controllers are the bridge between HTTP and business logic.


//  Complete Login Lifecycle (Conceptual)

// Client → POST /login
//         ↓
// Controller reads email/password
//         ↓
// Fetch user from DB
//         ↓
// Compare password via bcrypt
//         ↓
// Generate JWT
//         ↓
// Return token

// Client → Authorization: Bearer TOKEN
//         ↓
// Auth middleware verifies token
//         ↓
// req.user populated
//         ↓
// Protected controller executes



// exports.signup = async (req, res) => { ... }
// exports.login = async (req, res) => { ... }   This uses CommonJS named exports.