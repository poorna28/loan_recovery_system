const db = require('./db');

const calculateEMI = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const emi =
    (principal * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1);
  return Number(emi.toFixed(2));
};

const LoanCustomer = {

  // POST — createLoan
  // Receives already-normalized snake_case payload from controller
  createLoan: async (data) => {
    const {
      customer_id,
      loan_amount,
      loan_purpose,
      interest_rate,
      loan_term,
      application_date,
      status_approved,
      monthly_payment,
      next_payment_due,
      remaining_balance,
    } = data;

    const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];
    const safeStatus =
      status_approved && ALLOWED_STATUSES.includes(status_approved)
        ? status_approved
        : 'PENDING';

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO loan_customer (
          customer_id,
          loan_amount,
          loan_purpose,
          interest_rate,
          loan_term,
          application_date,
          status_approved,
          monthly_payment,
          next_payment_due,
          remaining_balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        customer_id,
        loan_amount       ?? null,
        loan_purpose      ?? null,
        interest_rate     ?? null,
        loan_term         ?? null,
        application_date  || null,
        safeStatus,
        monthly_payment   ?? null,
        next_payment_due  || null,
        remaining_balance ?? null,
      ];

      console.log("🗄️ INSERT values:", values);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('❌ Insert Error:', err.sqlMessage || err.message);
          return reject(err);
        }

        const insertId = results.insertId;
        const loan_id = `USR${1000 + insertId}`;

        db.query(
          'UPDATE loan_customer SET loan_id = ? WHERE id = ?',
          [loan_id, insertId],
          (err2) => {
            if (err2) {
              console.error('❌ Loan ID Update Error:', err2.sqlMessage || err2.message);
              return reject(err2);
            }
            resolve({ id: insertId, loan_id });
          }
        );
      });
    });
  },

  // PUT — updateLoanCustomerById
  // Receives already-normalized snake_case payload from controller
  updateLoanCustomerById: async (id, data) => {
    const {
      customer_id,
      loan_amount,
      loan_purpose,
      interest_rate,
      loan_term,
      application_date,
      status_approved,
      monthly_payment,
      next_payment_due,
      remaining_balance,
    } = data;

    const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];
    // undefined → COALESCE in SQL keeps existing DB value unchanged
    const safeStatus =
      status_approved && ALLOWED_STATUSES.includes(status_approved)
        ? status_approved
        : null;

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE loan_customer SET
          customer_id       = ?,
          loan_amount       = ?,
          loan_purpose      = ?,
          interest_rate     = ?,
          loan_term         = ?,
          application_date  = ?,
          status_approved   = COALESCE(?, status_approved),
          monthly_payment   = ?,
          next_payment_due  = ?,
          remaining_balance = ?
        WHERE id = ?
      `;

      const values = [
        customer_id,
        loan_amount       ?? null,
        loan_purpose      ?? null,
        interest_rate     ?? null,
        loan_term         ?? null,
        application_date  || null,
        safeStatus,               // null → COALESCE keeps existing status
        monthly_payment   ?? null,
        next_payment_due  || null,
        remaining_balance ?? null,
        id,
      ];

      console.log("🗄️ UPDATE values:", values);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('❌ SQL Update Error:', err.sqlMessage || err.message);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // GET all
  getAllLoanCustomers: async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM loan_customer', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // GET one by numeric PK
  getLoanCustomerById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM loan_customer WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0] || null);
        }
      );
    });
  },

  // DELETE by numeric PK
  deleteLoanCustomerById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM loan_customer WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // GET loans by customer_id
  getLoansByCustomerId: async (customer_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM loan_customer WHERE customer_id = ?',
        [customer_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // PATCH — update status only
  updateStatus: async (id, status) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE loan_customer SET status_approved = ? WHERE id = ?',
        [status, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // PATCH — activate loan (auto-calculate EMI fields)
  activateLoan: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT loan_amount, interest_rate, loan_term, status_approved
         FROM loan_customer WHERE id = ?`,
        [id],
        (err, results) => {
          if (err) return reject(err);
          if (!results.length) return reject(new Error('Loan not found'));

          const loan = results[0];

          if (loan.status_approved === 'ACTIVE') {
            return reject(new Error('Loan already active'));
          }

          const monthlyPayment = calculateEMI(
            Number(loan.loan_amount),
            Number(loan.interest_rate),
            Number(loan.loan_term)
          );

          const remainingBalance = Number(loan.loan_amount);

          // Calculate next payment due as one month from today
          const nextPaymentDue = new Date();
          nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);
          // Format as DATE (YYYY-MM-DD) not datetime
          const nextPaymentDueFormatted = nextPaymentDue.toISOString().split('T')[0];

          db.query(
            `UPDATE loan_customer SET
               status_approved   = 'ACTIVE',
               monthly_payment   = ?,
               remaining_balance = ?,
               next_payment_due  = ?
             WHERE id = ?`,
            [monthlyPayment, remainingBalance, nextPaymentDueFormatted, id],
            (err2, result) => {
              if (err2) return reject(err2);
              resolve(result);
            }
          );
        }
      );
    });
  },
};

module.exports = LoanCustomer;