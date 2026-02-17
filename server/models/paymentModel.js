const db = require('./db');
const { processPayment } = require('../utils/paymentEngine');

const PaymentModel = {

  getAllPayments: async () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM loan_payments ORDER BY payment_date DESC`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  deletePaymentById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM loan_payments WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  makePayment: async (loanId, paymentAmount, method = 'CASH') => {
    return new Promise((resolve, reject) => {

      db.query(
        `SELECT id, loan_id, interest_rate, remaining_balance, status_approved
         FROM loan_customer WHERE id = ?`,
        [loanId],
        (err, results) => {
          if (err) return reject(err);
          if (!results.length) return reject(new Error('Loan not found'));

          const loan = results[0];

          if (loan.status_approved !== 'ACTIVE') {
            return reject(new Error('Payments allowed only for ACTIVE loans'));
          }

          const balance = Number(loan.remaining_balance);

          if (paymentAmount <= 0) {
            return reject(new Error('Invalid payment amount'));
          }

          const cappedPayment =
            paymentAmount > balance ? balance : paymentAmount;

          const allocation = processPayment({
            balance,
            annualRate: loan.interest_rate,
            paymentAmount: cappedPayment
          });

          const nextDue = new Date();
          nextDue.setMonth(nextDue.getMonth() + 1);

          db.query(
            `INSERT INTO loan_payments
             (loan_customer_id, loan_id, amount_paid, payment_date,
              payment_method, principal_component, interest_component, remaining_balance)
             VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)`,
            [
              loanId,
              loan.loan_id,
              cappedPayment,
              method,
              allocation.principalComponent,
              allocation.interestComponent,
              allocation.remainingBalance
            ],
            (err2) => {
              if (err2) return reject(err2);

              db.query(
                `UPDATE loan_customer SET
                    remaining_balance = ?,
                    next_payment_due = ?
                 WHERE id = ?`,
                [allocation.remainingBalance, nextDue, loanId],
                (err3) => {
                  if (err3) return reject(err3);

                  resolve({
                    loan_id: loan.loan_id,
                    amount_paid: cappedPayment,
                    payment_method: method,
                    ...allocation
                  });
                }
              );
            }
          );
        }
      );
    });
  }
};

module.exports = PaymentModel;
