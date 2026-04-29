const db = require('./db');
const bcrypt = require('bcrypt');

const User = {

  // FIXED: JOIN with user_roles and roles so role_name comes back with the user
  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT u.*, COALESCE(r.role_name, 'Staff') AS role
         FROM users u
         LEFT JOIN user_roles ur ON u.id = CAST(ur.user_id AS UNSIGNED)
         LEFT JOIN roles r ON ur.role_id = r.id
         WHERE u.email = ?`,
        [email],
        (err, results) => {
          if (err) reject(err);
          else resolve([results]);
        }
      );
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