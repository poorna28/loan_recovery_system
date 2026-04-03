const db = require('../models/db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)))
  );

// GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      kpisArr,
      recentPayments,
      overdueLoans,
      loanStatusBreakdown,
      monthlyTrend,
    ] = await Promise.all([

      // ── KPI Cards ──────────────────────────────────────────────────────────
      query(`
        SELECT
          (SELECT COUNT(*) FROM customers)                               AS total_customers,
          (SELECT COUNT(*) FROM loan_customer)                           AS total_loans,
          (SELECT COALESCE(SUM(amount_paid), 0) FROM loan_payments)     AS total_collected,
          (SELECT COALESCE(SUM(remaining_balance), 0)
           FROM loan_customer WHERE status_approved = 'ACTIVE')         AS total_pending,
          (SELECT COUNT(*) FROM loan_customer
           WHERE status_approved = 'ACTIVE')                            AS active_loans,
          (SELECT COUNT(*) FROM loan_customer
           WHERE status_approved = 'ACTIVE'
             AND next_payment_due < CURDATE())                          AS overdue_count
      `),

      // ── Recent Payments (last 5) ───────────────────────────────────────────
      query(`
        SELECT
          p.id,
          p.loan_id,
          p.amount_paid,
          p.payment_method,
          DATE_FORMAT(p.payment_date, '%d %b %Y')                      AS payment_date,
          TIMESTAMPDIFF(MINUTE, p.payment_date, NOW())                  AS minutes_ago,
          CONCAT(COALESCE(c.firstName,''), ' ', COALESCE(c.lastName,'')) AS customer_name
        FROM loan_payments p
        LEFT JOIN loan_customer lc ON lc.id = p.loan_customer_id
        LEFT JOIN customers c      ON c.customer_id = lc.customer_id
        ORDER BY p.payment_date DESC
        LIMIT 5
      `),

      // ── Overdue Alerts (top 5 worst) ───────────────────────────────────────
      query(`
        SELECT
          lc.loan_id,
          lc.remaining_balance,
          DATEDIFF(CURDATE(), lc.next_payment_due)                      AS days_overdue,
          DATE_FORMAT(lc.next_payment_due, '%d %b %Y')                  AS due_date,
          CONCAT(COALESCE(c.firstName,''), ' ', COALESCE(c.lastName,'')) AS customer_name
        FROM loan_customer lc
        LEFT JOIN customers c ON c.customer_id = lc.customer_id
        WHERE lc.status_approved = 'ACTIVE'
          AND lc.next_payment_due < CURDATE()
        ORDER BY days_overdue DESC
        LIMIT 5
      `),

      // ── Loan Status Breakdown ──────────────────────────────────────────────
      query(`
        SELECT status_approved AS status, COUNT(*) AS count
        FROM loan_customer
        GROUP BY status_approved
      `),

      // ── Monthly Collection Trend (last 6 months) ───────────────────────────
      query(`
        SELECT
          DATE_FORMAT(payment_date, '%b')        AS month,
          COALESCE(SUM(amount_paid), 0)          AS collected
        FROM loan_payments
        WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(payment_date, '%Y-%m'), DATE_FORMAT(payment_date, '%b')
        ORDER BY MIN(payment_date)
      `),
    ]);

    res.set('Cache-Control', 'no-store');
    res.json({
      kpis: kpisArr[0] || {},
      recentPayments,
      overdueLoans,
      loanStatusBreakdown,
      monthlyTrend,
    });

  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};