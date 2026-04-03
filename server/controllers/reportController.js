const reportModel = require('../models/reportmodel');
// ── GET /api/reports/summary ──────────────────────────────────────────────────
exports.getSummary = async (req, res) => {
  try {
    const [kpisArr, loans, statusBreakdown, monthlyDisbursement] = await Promise.all([
      reportModel.getSummaryKPIs(),
      reportModel.getAllLoans(),
      reportModel.getStatusBreakdown(),
      reportModel.getMonthlyDisbursement(),
    ]);

    res.set('Cache-Control', 'no-store');
    res.json({
      kpis: kpisArr[0] || {},
      loans,
      statusBreakdown,
      monthlyDisbursement,
    });
  } catch (err) {
    console.error('❌ Report summary error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/reports/payments ─────────────────────────────────────────────────
exports.getPayments = async (req, res) => {
  try {
    const [kpisArr, payments] = await Promise.all([
      reportModel.getPaymentKPIs(),
      reportModel.getAllPayments(),
    ]);

    res.set('Cache-Control', 'no-store');
    res.json({
      kpis: kpisArr[0] || {},
      payments,
    });
  } catch (err) {
    console.error('❌ Report payments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/reports/overdue ──────────────────────────────────────────────────
exports.getOverdue = async (req, res) => {
  try {
    const [kpisArr, loans] = await Promise.all([
      reportModel.getOverdueKPIs(),
      reportModel.getOverdueLoans(),
    ]);

    res.set('Cache-Control', 'no-store');
    res.json({
      kpis: kpisArr[0] || {},
      loans,
    });
  } catch (err) {
    console.error('❌ Report overdue error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/reports/customers ────────────────────────────────────────────────
exports.getCustomers = async (req, res) => {
  try {
    const [kpisArr, customers] = await Promise.all([
      reportModel.getCustomerSummaryKPIs(),
      reportModel.getCustomerReport(),
    ]);

    res.set('Cache-Control', 'no-store');
    res.json({
      kpis: kpisArr[0] || {},
      customers,
    });
  } catch (err) {
    console.error('❌ Report customers error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};