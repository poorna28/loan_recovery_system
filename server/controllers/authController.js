const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

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
