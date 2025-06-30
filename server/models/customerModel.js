const db = require('./db');

const Customer = {
  createCustomer: async ({ name, email, ...otherFields }) => {
    return new Promise((resolve, reject) => {
      // First, insert the customer without customer_id to get the auto-increment id
      db.query(
        'INSERT INTO customers (name, email, ...) VALUES (?, ?, ...)',
        [name, email, /* other fields */],
        (err, results) => {
          if (err) return reject(err);
          const insertId = results.insertId;
          const customerId = `USR${1000 + insertId}`;
          // Update the customer_id field
          db.query(
            'UPDATE customers SET customer_id = ? WHERE id = ?',
            [customerId, insertId],
            (err2) => {
              if (err2) return reject(err2);
              resolve({ id: insertId, customerId });
            }
          );
        }
      );
    });
  },
  // ...other methods...
};

module.exports = Customer;