const db = require('./db');

const LoanCustomer = {

  createLoan: async (data) => {
    const {
      loanAmount,
      loanPurpose,
      interestRate,
      loanTerm,
      aplicationDate,
      statusApproved,
      monthlyPayment,
      nextPaymentDue,
      remainingBalance

    } = data;

    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO loan_customer (
    loan_amount,
    loan_purpose,
    interest_rate,
    loan_term,
    application_date,
    status_approved,
    monthly_payment,
    next_payment_due,
    remaining_balance
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;


      const values = [
        loanAmount,
        loanPurpose,
        interestRate,
        loanTerm,
        aplicationDate,
        statusApproved,
        monthlyPayment,
        nextPaymentDue,
        remainingBalance
      ]

      db.query(sql, values, (err, results) => {
        if (err) return reject(err);

        const insertId = results.insertId;
        const loan_id = `USR${1000 + insertId}`;

        db.query(
          'UPDATE loan_customer  SET loan_id = ? WHERE id = ?',
          [loan_id, insertId],
          (err2) => {
            if (err2) return reject(err2);
            resolve({ id: insertId, loan_id });
          }
        );
      });
    })
  },

  // Update existing customer
  updateLoanCustomer: async (loan_id, data) => {
    const {
      loanAmount,
      loanPurpose,
      interestRate,
      loanTerm,
      aplicationDate,
      statusApproved,
      monthlyPayment,
      nextPaymentDue,
      remainingBalance
    } = data;

    return new Promise((resolve, reject) => {
const sql = `
    UPDATE loan_customer SET
        loan_amount = ?,
        loan_purpose = ?,
        interest_rate = ?,
        loan_term = ?,
        application_date = ?,
        status_approved = ?,
        monthly_payment = ?,
        next_payment_due = ?,
        remaining_balance = ?
    WHERE loan_id = ?
`;


      const values = [
        loanAmount,
        loanPurpose,
        interestRate,
        loanTerm,
        aplicationDate || null,
        statusApproved,
        monthlyPayment,
        nextPaymentDue,
        remainingBalance,
        loan_id
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
      db.query('SELECT * FROM loan_customer ', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Delete a customer by customer_id
  deleteLoanCustomer: async (loan_id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM loan_customer  WHERE loan_id = ?', [loan_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }






};

module.exports = LoanCustomer;