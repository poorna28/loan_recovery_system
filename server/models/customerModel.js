const db = require('./db');

const Customer = {
  createCustomer: async ({
    firstName, email, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO customers (firstName, email, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, email, PhoneNumber, dateOfBirth, address, EmploymentStatus, AnnualIncome, creditScore],
        (err, results) => {
          if (err) return reject(err);
          const insertId = results.insertId;
          const customerId = `USR${1000 + insertId}`;
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