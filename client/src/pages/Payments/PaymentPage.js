import './payments.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import Payment_View from './payment_view';
import Payment_Form from './payment_form';
import { toast } from 'react-toastify';
import { buildUrl } from '../../utils/queryBuilder';

// ─── Helpers ──────────────────────────
const fmtINR = (val) => {
  const n = Number(val || 0);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${n.toLocaleString('en-IN')}`;
  return `₹${n}`;
};

const PaymentPage  = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPayment, setViewPayment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'paymentDate',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
    paymentMethod: ''
  });
  const [kpiData, setKpiData] = useState({
    totalCollected: 0,
    totalTransactions: 0,
    avgPayment: 0,
    methodBreakdown: {}
  });

  const fetchAll = useCallback(() => {
    setLoading(true);

    const url = buildUrl('payments', filters);
    api.get(url)
      .then(res => {
        const mapped = res.data.payments.map(item => ({
          payment_id: item.id,
          loan_id: item.loan_id,
          amountPaid: item.amount_paid,
          paymentDate: item.payment_date
            ? item.payment_date.substring(0, 10)
            : null,
          paymentMethod: item.payment_method,
          principalComponent: item.principal_component,
          interestComponent: item.interest_component,
          remainingBalance: item.remaining_balance,
        }));

        setPayments(mapped);

        // Calculate KPIs
        const totalCollected = mapped.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
        const totalTransactions = mapped.length;
        const avgPayment = totalTransactions > 0 ? Math.round(totalCollected / totalTransactions) : 0;

        setKpiData({
          totalCollected,
          totalTransactions,
          avgPayment,
          methodBreakdown: {}
        });

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch payments:', err);
        toast.error('Failed to load payments');
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleView = (payment) => {
    setViewPayment(payment);
    const modalEl = document.getElementById('viewPaymentModal');
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      setDeleteLoading(id);
      try {
        await api.delete(`/payments/${id}`);
        setPayments(prev => prev.filter(p => p.payment_id !== id));
        toast.success('Payment deleted successfully');
      } catch (err) {
        console.error('Delete failed:', err);
        const errorMsg = err.response?.data?.message || 'Failed to delete payment';
        toast.error(errorMsg);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handlePaymentSuccess = () => {
    fetchAll();
  };

  const openMakePaymentModal = () => {
    const modalEl = document.getElementById('makePaymentModal');
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const getMethodColor = (method) => {
    switch ((method || '').toUpperCase()) {
      case 'CASH':
        return 'cash';
      case 'CHECK':
        return 'check';
      case 'TRANSFER':
        return 'transfer';
      case 'CARD':
        return 'card';
      default:
        return 'card';
    }
  };

  const kpiCards = [
    {
      color: 'green',
      icon: '💰',
      label: 'Total Collected',
      value: fmtINR(kpiData.totalCollected),
      subtext: 'All payments'
    },
    {
      color: 'violet',
      icon: '📊',
      label: 'Transactions',
      value: kpiData.totalTransactions,
      subtext: 'Total count'
    },
    {
      color: 'blue',
      icon: '📈',
      label: 'Avg Payment',
      value: fmtINR(kpiData.avgPayment),
      subtext: 'Per transaction'
    },
    {
      color: 'orange',
      icon: '⏳',
      label: 'Status',
      value: loading ? '—' : 'Live',
      subtext: 'Real-time'
    }
  ];

  return (
    <Layout>
      <div className="payments-ui">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Payments</h2>
          </div>
          <div className="topbar-right">
            <button
              className="btn-add"
              onClick={openMakePaymentModal}
            >
              ➕ Make Payment
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          {kpiCards.map((k) => (
            <div key={k.label} className={`kpi ${k.color}`}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-subtext">{k.subtext}</div>
            </div>
          ))}
        </div>

        {/* Payments Table Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Payment History</div>
            <div className="card-controls">
              <span style={{ fontSize: '11px', color: '#7880a0' }}>
                {loading ? 'Loading...' : `${payments.length} payments`}
              </span>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <table>
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="loading-row">
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '90px' }} /></td>
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : payments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No payments recorded. Make a payment to get started.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.payment_id}>
                      <td>{payment.loan_id}</td>
                      <td className="amount">{fmtINR(payment.amountPaid)}</td>
                      <td>{payment.paymentDate}</td>
                      <td>
                        <span className={`method-badge ${getMethodColor(payment.paymentMethod)}`}>
                          {payment.paymentMethod || '—'}
                        </span>
                      </td>
                      <td className="amount">{fmtINR(payment.principalComponent)}</td>
                      <td className="amount debited">{fmtINR(payment.interestComponent)}</td>
                      <td className="amount">{fmtINR(payment.remainingBalance)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => handleView(payment)}
                            title="View"
                          >
                            👁
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDelete(payment.payment_id)}
                            disabled={deleteLoading === payment.payment_id}
                            title={deleteLoading === payment.payment_id ? "Deleting..." : "Delete"}
                          >
                            {deleteLoading === payment.payment_id ? '⏳' : '🗑'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Payment_Form onPaymentSuccess={handlePaymentSuccess} />
      <Payment_View viewData={viewPayment} />
    </Layout>
  );
};

export default PaymentPage;
