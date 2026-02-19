const calculateEMI = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;

  if (r === 0) return principal / months;

  const emi =
    (principal * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1);

  return Number(emi.toFixed(2));
};
  


const db = require('./db');

const LoanCustomer = {
  createLoan: async (data) => {
    const {
      customer_id,
      loanAmount,
      loanPurpose,
      interestRate,
      loanTerm,
      applicationDate,
      statusApproved,
      monthlyPayment,
      nextPaymentDue,
      remainingBalance
    } = data;

      const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];

const safeStatus =
  statusApproved && ALLOWED_STATUSES.includes(statusApproved)
    ? statusApproved
    : undefined;   //  DO NOT OVERRIDE EXISTING STATUS


    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO loan_customer (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        customer_id,
        loanAmount,
        loanPurpose,
        interestRate,
        loanTerm,
        applicationDate || null,
        // statusApproved,
        safeStatus,
        monthlyPayment || null,
        nextPaymentDue || null,
        remainingBalance
      ];

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

  // Update by numeric primary id
  updateLoanCustomerById: async (id, data) => {
    const {
      customer_id,
      loanAmount,
      loanPurpose,
      interestRate,
      loanTerm,
      applicationDate,
      statusApproved,
      monthlyPayment,
      nextPaymentDue,
      remainingBalance
    } = data;


      const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'];

const safeStatus =
  statusApproved && ALLOWED_STATUSES.includes(statusApproved)
    ? statusApproved
    : undefined;   //  DO NOT OVERRIDE EXISTING STATUS


    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE loan_customer SET
         customer_id = ?,
          loan_amount = ?,
          loan_purpose = ?,
          interest_rate = ?,
          loan_term = ?,
          application_date = ?,
    status_approved = COALESCE(?, status_approved),
          monthly_payment = ?,
          next_payment_due = ?,
          remaining_balance = ?
        WHERE id = ?
      `;

      const values = [
        customer_id,
        loanAmount,
        loanPurpose,
        interestRate,
        loanTerm,
        applicationDate || null,
        safeStatus,
        monthlyPayment || null,
        nextPaymentDue || null,
        remainingBalance || null,
        id
      ];

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('❌ SQL Error:', err.sqlMessage || err.message);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Get all customers
  getAllLoanCustomers: async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM loan_customer', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get one by id (primary key)
  getLoanCustomerById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM loan_customer WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Delete by numeric primary id
  deleteLoanCustomerById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM loan_customer WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getLoansByCustomerId: async (customer_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM loan_customer WHERE customer_id = ?",
      [customer_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
},


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

activateLoan: async (id) => {
  return new Promise((resolve, reject) => {

    db.query(
      `SELECT loan_amount, interest_rate, loan_term, status_approved
       FROM loan_customer WHERE id = ?`,
      [id],
      (err, results) => {
        if (err) return reject(err);
        if (!results.length) return reject(new Error('Loan not found'));

        const loan = results[0];   // ✅ MUST COME FIRST

        if (loan.status_approved === 'ACTIVE') {
          return reject(new Error('Loan already active'));
        }

        const monthlyPayment = calculateEMI(
          Number(loan.loan_amount),
          Number(loan.interest_rate),
          Number(loan.loan_term)
        );

        const remainingBalance = Number(loan.loan_amount);

        const nextPaymentDue = new Date();
        nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);

        db.query(
          `UPDATE loan_customer SET
             status_approved = 'ACTIVE',
             monthly_payment = ?,
             remaining_balance = ?,
             next_payment_due = ?
           WHERE id = ?`,
          [monthlyPayment, remainingBalance, nextPaymentDue, id],
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