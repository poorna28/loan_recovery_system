const jwt = require('jsonwebtoken'); //Dependencies //Creates authentication tokens
const bcrypt = require('bcrypt'); //Dependencies //Safely compares hashed passwords 
const userModel = require('../models/userModel'); //Dependencies //Database access layer

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const [existing] = await userModel.findUserByEmail(email);
        if (existing.length) return res.status(400).json({ message: 'Email already exists' });

        await userModel.createUser({ name, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await userModel.findUserByEmail(email);
        if (!user.length) return res.status(400).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
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