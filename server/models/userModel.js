const db = require('./db');
const bcrypt = require('bcrypt');

const User = {
  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
  },

  createUser: async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },
};

module.exports = User;
