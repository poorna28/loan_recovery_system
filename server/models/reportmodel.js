const db = require('./db');

const query = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)))
  );

const ReportModel = {

  // ── LOAN SUMMARY TAB ──────────────────────────────────────────────────────

  getSummaryKPIs: () => query(`
    SELECT
      COUNT(*)                                                        AS total_loans,
      COALESCE(SUM(loan_amount), 0)                                   AS total_issued,
      COUNT(CASE WHEN status_approved = 'ACTIVE'   THEN 1 END)       AS active_loans,
      COUNT(CASE WHEN status_approved = 'APPROVED' THEN 1 END)       AS approved_loans,
      COUNT(CASE WHEN status_approved = 'PENDING'  THEN 1 END)       AS pending_loans,
      COUNT(CASE WHEN status_approved = 'REJECTED' THEN 1 END)       AS rejected_loans,
      COALESCE(SUM(CASE WHEN status_approved = 'ACTIVE' THEN remaining_balance END), 0) AS outstanding
    FROM loan_customer
  `),

  getAllLoans: () => query(`
    SELECT
      lc.id,
      lc.loan_id,
      lc.loan_amount,
      lc.loan_purpose,
      lc.interest_rate,
      lc.loan_term,
      DATE_FORMAT(lc.application_date, '%d %b %Y') AS application_date,
      lc.status_approved,
      lc.monthly_payment,
      lc.next_payment_due,
      lc.remaining_balance,
      lc.customer_id,
      CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name
    FROM loan_customer lc
    LEFT JOIN customers c ON c.customer_id = lc.customer_id
    ORDER BY lc.id DESC
    LIMIT 100
  `),

  getStatusBreakdown: () => query(`
    SELECT status_approved AS status, COUNT(*) AS count
    FROM loan_customer
    GROUP BY status_approved
  `),

  getMonthlyDisbursement: () => query(`
    SELECT
      DATE_FORMAT(application_date, '%b %Y') AS month,
      COUNT(*)                               AS count,
      COALESCE(SUM(loan_amount), 0)          AS total_amount
    FROM loan_customer
    WHERE application_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(application_date, '%Y-%m'), DATE_FORMAT(application_date, '%b %Y')
    ORDER BY MIN(application_date)
  `),

  // ── PAYMENTS TAB ──────────────────────────────────────────────────────────

  getPaymentKPIs: () => query(`
    SELECT
      COALESCE(SUM(p.amount_paid), 0)                              AS total_collected,
      COUNT(p.id)                                                  AS total_transactions,
      COALESCE(AVG(p.amount_paid), 0)                             AS avg_payment,
      COUNT(CASE WHEN lc.status_approved = 'ACTIVE'
                  AND lc.next_payment_due < CURDATE() THEN 1 END) AS missed_emis
    FROM loan_payments p
    RIGHT JOIN loan_customer lc ON lc.id = p.loan_customer_id
  `),

  getAllPayments: () => query(`
    SELECT
      p.id,
      p.loan_id,
      p.amount_paid,
      DATE_FORMAT(p.payment_date, '%d %b %Y') AS payment_date,
      p.payment_method,
      p.principal_component,
      p.interest_component,
      p.remaining_balance,
      CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name
    FROM loan_payments p
    LEFT JOIN loan_customer lc ON lc.id = p.loan_customer_id
    LEFT JOIN customers c ON c.customer_id = lc.customer_id
    ORDER BY p.payment_date DESC
    LIMIT 100
  `),

  // ── OVERDUE TAB ───────────────────────────────────────────────────────────

  getOverdueKPIs: () => query(`
    SELECT
      COUNT(*)                                                              AS total_overdue,
      COALESCE(SUM(remaining_balance), 0)                                  AS at_risk_amount,
      COUNT(CASE WHEN DATEDIFF(CURDATE(), next_payment_due) >= 30 THEN 1 END) AS over_30,
      COUNT(CASE WHEN DATEDIFF(CURDATE(), next_payment_due) >= 90 THEN 1 END) AS over_90
    FROM loan_customer
    WHERE status_approved = 'ACTIVE'
      AND next_payment_due < CURDATE()
  `),

  getOverdueLoans: () => query(`
    SELECT
      lc.id,
      lc.loan_id,
      lc.remaining_balance,
      DATE_FORMAT(lc.next_payment_due, '%d %b %Y') AS next_payment_due,
      lc.monthly_payment,
      DATEDIFF(CURDATE(), lc.next_payment_due)       AS days_overdue,
      CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name,
      c.phoneNumber AS phone
    FROM loan_customer lc
    LEFT JOIN customers c ON c.customer_id = lc.customer_id
    WHERE lc.status_approved = 'ACTIVE'
      AND lc.next_payment_due < CURDATE()
    ORDER BY days_overdue DESC
    LIMIT 100
  `),

  // ── CUSTOMER-WISE TAB ────────────────────────────────────────────────────

  getCustomerSummaryKPIs: () => query(`
    SELECT
      COUNT(DISTINCT c.customer_id)                                       AS total_customers,
      COUNT(DISTINCT CASE WHEN lc.status_approved NOT IN ('ACTIVE') OR lc.next_payment_due >= CURDATE() OR lc.next_payment_due IS NULL
                          THEN c.customer_id END)                         AS good_standing,
      COUNT(DISTINCT CASE WHEN lc.status_approved = 'ACTIVE'
                           AND lc.next_payment_due < CURDATE()
                          THEN c.customer_id END)                         AS defaulters
    FROM customers c
    LEFT JOIN loan_customer lc ON lc.customer_id = c.customer_id
  `),

  getCustomerReport: () => query(`
    SELECT
      c.customer_id,
      CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name,
      c.phoneNumber                                                      AS phone,
      COUNT(lc.id)                                                       AS total_loans,
      COALESCE(SUM(lc.loan_amount), 0)                                   AS total_principal,
      COALESCE(SUM(lc.loan_amount - lc.remaining_balance), 0)           AS total_paid,
      COALESCE(SUM(lc.remaining_balance), 0)                            AS pending_amount,
      CASE
        WHEN SUM(lc.loan_amount) > 0
        THEN ROUND(
          SUM(lc.loan_amount - lc.remaining_balance) / SUM(lc.loan_amount) * 100, 1
        )
        ELSE 0
      END                                                                AS collection_pct,
      MAX(lc.status_approved)                                            AS status
    FROM customers c
    LEFT JOIN loan_customer lc ON lc.customer_id = c.customer_id
    GROUP BY c.customer_id, c.firstName, c.lastName, c.phoneNumber
    ORDER BY pending_amount DESC
    LIMIT 100
  `),

};

module.exports = ReportModel;