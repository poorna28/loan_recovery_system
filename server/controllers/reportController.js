const reportModel = require('../models/reportmodel');
// ── GET /api/reports/summary ──────────────────────────────────────────────────
exports.getSummary = async (req, res) => {
  try {
    const results = await Promise.allSettled([
      reportModel.getSummaryKPIs(),
      reportModel.getAllLoans(),
      reportModel.getStatusBreakdown(),
      reportModel.getMonthlyDisbursement(),
    ]);

    const kpisArr = results[0].status === 'fulfilled' ? results[0].value : [{}];
    const loans = results[1].status === 'fulfilled' ? results[1].value : [];
    const statusBreakdown = results[2].status === 'fulfilled' ? results[2].value : [];
    const monthlyDisbursement = results[3].status === 'fulfilled' ? results[3].value : [];

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`Summary query ${i} failed:`, r.reason);
      }
    });

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      kpis: kpisArr[0] || {},
      loans,
      statusBreakdown,
      monthlyDisbursement,
    });
  } catch (err) {
    console.error('Report summary error:', err);
    res.status(500).json({ success: false, message: 'Server error', errors: [err.message] });
  }
};

// ── GET /api/reports/payments ─────────────────────────────────────────────────
exports.getPayments = async (req, res) => {
  try {
    const results = await Promise.allSettled([
      reportModel.getPaymentKPIs(),
      reportModel.getAllPayments(),
    ]);

    const kpisArr = results[0].status === 'fulfilled' ? results[0].value : [{}];
    const payments = results[1].status === 'fulfilled' ? results[1].value : [];

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`Payments query ${i} failed:`, r.reason);
      }
    });

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      kpis: kpisArr[0] || {},
      payments,
    });
  } catch (err) {
    console.error('Report payments error:', err);
    res.status(500).json({ success: false, message: 'Server error', errors: [err.message] });
  }
};

// ── GET /api/reports/overdue ──────────────────────────────────────────────────
exports.getOverdue = async (req, res) => {
  try {
    const results = await Promise.allSettled([
      reportModel.getOverdueKPIs(),
      reportModel.getOverdueLoans(),
    ]);

    const kpisArr = results[0].status === 'fulfilled' ? results[0].value : [{}];
    const loans = results[1].status === 'fulfilled' ? results[1].value : [];

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`Overdue query ${i} failed:`, r.reason);
      }
    });

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      kpis: kpisArr[0] || {},
      loans,
    });
  } catch (err) {
    console.error('Report overdue error:', err);
    res.status(500).json({ success: false, message: 'Server error', errors: [err.message] });
  }
};

// ── GET /api/reports/customers ────────────────────────────────────────────────
exports.getCustomers = async (req, res) => {
  try {
    const results = await Promise.allSettled([
      reportModel.getCustomerSummaryKPIs(),
      reportModel.getCustomerReport(),
    ]);

    const kpisArr = results[0].status === 'fulfilled' ? results[0].value : [{}];
    const customers = results[1].status === 'fulfilled' ? results[1].value : [];

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`Customer query ${i} failed:`, r.reason);
      }
    });

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      kpis: kpisArr[0] || {},
      customers,
    });
  } catch (err) {
    console.error('Report customers error:', err);
    res.status(500).json({ success: false, message: 'Server error', errors: [err.message] });
  }
};