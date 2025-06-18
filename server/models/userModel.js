const db = require('./db');
const bcrypt = require('bcrypt');

exports.createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        [user.name, user.email, hashedPassword, user.role || 'customer']);
};

exports.findUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
};
