import './loans.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import Loan_List_Details from './loan_list_details';
import Loan_List_View from './loan_list_view';
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

const Loan_Details = () => {
  const [loanCustomers, setLoanCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoanCustomer, setEditLoanCustomer] = useState(null);
  const [viewLoanCustomer, setViewLoanCustomer] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'applicationDate',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
    loanStatus: ''
  });
  const [kpiData, setKpiData] = useState({
    total: 0,
    active: 0,
    pending: 0,
    totalAmount: 0
  });

  const fetchAll = useCallback(() => {
    setLoading(true);
    const url = buildUrl('loan_customers', filters);
    api.get(url)
      .then(res => {
        const mapped = res.data.loan_customers.map(item => ({
          loan_customer_id: item.id,
          loan_id: item.loan_id,
          loanAmount: item.loan_amount ?? null,
          loanPurpose: item.loan_purpose ?? null,
          interestRate: item.interest_rate ?? null,
          loanTerm: item.loan_term ?? null,
          applicationDate: item.application_date
            ? item.application_date.substring(0, 10)
            : null,
          statusApproved: item.status_approved ?? null,
          monthlyPayment: item.monthly_payment ?? null,
          nextPaymentDue: item.next_payment_due
            ? item.next_payment_due.substring(0, 10)
            : null,
          remainingBalance: item.remaining_balance ?? null,
        }));

        setLoanCustomers(mapped);

        // Calculate KPIs
        const total = mapped.length;
        const active = mapped.filter(l => l.statusApproved === 'ACTIVE').length;
        const pending = mapped.filter(l => l.statusApproved === 'PENDING').length;
        const totalAmount = mapped.reduce((sum, l) => sum + (Number(l.loanAmount) || 0), 0);

        setKpiData({ total, active, pending, totalAmount });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch loan customers:', err);
        toast.error('Failed to load loan customers.');
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const fetchLoanCustomerById = async (id) => {
    try {
      const res = await api.get(`/loan_customers/${id}`);
      const loan = res.data?.loan_customer || res.data;

      setEditLoanCustomer({
        id: loan.id,
        loanId: loan.loan_id,
        loanAmount: loan.loan_amount ?? "",
        loanPurpose: loan.loan_purpose ?? "",
        interestRate: loan.interest_rate ?? "",
        loanTerm: loan.loan_term ?? "",
        applicationDate: loan.application_date
          ? loan.application_date.substring(0, 10)
          : "",
        statusApproved: loan.status_approved ?? "",
        monthlyPayment: loan.monthly_payment ?? "",
        nextPaymentDue: loan.next_payment_due
          ? loan.next_payment_due.substring(0, 10)
          : "",
        remainingBalance: loan.remaining_balance ?? "",
        customerId: loan.customer_id ?? "",
      });
    } catch (err) {
      console.error('Failed to fetch loan customer by ID:', err);
      toast.error('Failed to fetch loan customer details.');
    }
  };

  const openModal = () => {
    const modalEl = document.getElementById("addLoanCustomerModal");
    if (modalEl) {
      const modal =
        window.bootstrap.Modal.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const handleAddClick = () => {
    setEditLoanCustomer(null);
    setTimeout(openModal, 0);
  };

  const handleEditClick = async (loanCustomer) => {
    await fetchLoanCustomerById(loanCustomer.loan_customer_id);
    openModal();
  };

  const handleView = (loanCustomer) => {
    setViewLoanCustomer(loanCustomer);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await api.delete(`/loan_customers/${id}`);
        toast.success('Loan deleted successfully.');
        fetchAll();
      } catch (err) {
        console.error('Delete failed:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete loan.';
        toast.error(errorMsg);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'active';
      case 'APPROVED':
        return 'approved';
      case 'PENDING':
        return 'pending';
      case 'REJECTED':
        return 'rejected';
      default:
        return 'approved';
    }
  };

  const kpiCards = [
    {
      color: 'blue',
      icon: '📋',
      label: 'Total Loans',
      value: kpiData.total,
      subtext: 'All loans'
    },
    {
      color: 'green',
      icon: '✓',
      label: 'Active',
      value: kpiData.active,
      subtext: `${Math.round((kpiData.active / (kpiData.total || 1)) * 100)}% of total`
    },
    {
      color: 'violet',
      icon: '⏳',
      label: 'Pending',
      value: kpiData.pending,
      subtext: 'Awaiting approval'
    },
    {
      color: 'red',
      icon: '💰',
      label: 'Total Principal',
      value: fmtINR(kpiData.totalAmount),
      subtext: 'Disbursed amount'
    }
  ];

  return (
    <Layout>
      <div className="loans-ui">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Loans</h2>
          </div>
          <div className="topbar-right">
            <button
              className="btn-add"
              onClick={handleAddClick}
            >
              ➕ Add Loan
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          {kpiCards.map((k) => (
            <div key={k.label} className={`kpi ${k.color}`}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{loading ? '—' : k.value}</div>
              <div className="kpi-subtext">{k.subtext}</div>
            </div>
          ))}
        </div>

        {/* Loans Table Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Loan List</div>
            <div className="card-controls">
              <span style={{ fontSize: '11px', color: '#7880a0' }}>
                {loading ? 'Loading...' : `${loanCustomers.length} loans`}
              </span>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Rate</th>
                    <th>Term</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>EMI</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="loading-row">
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '120px' }} /></td>
                      <td><div className="skeleton" style={{ width: '60px' }} /></td>
                      <td><div className="skeleton" style={{ width: '60px' }} /></td>
                      <td><div className="skeleton" style={{ width: '90px' }} /></td>
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '90px' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : loanCustomers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No loans found. Add one to get started.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Rate</th>
                    <th>Term</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>EMI</th>
                    <th>Balance</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loanCustomers.map((loanCustomer) => (
                    <tr key={loanCustomer.loan_customer_id}>
                      <td>{loanCustomer.loan_id}</td>
                      <td className="amount">{loanCustomer.loanAmount ? fmtINR(loanCustomer.loanAmount) : '—'}</td>
                      <td>{loanCustomer.loanPurpose ?? '—'}</td>
                      <td>{loanCustomer.interestRate ? `${loanCustomer.interestRate}%` : '—'}</td>
                      <td>{loanCustomer.loanTerm ? `${loanCustomer.loanTerm}mo` : '—'}</td>
                      <td>{loanCustomer.applicationDate ?? '—'}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(loanCustomer.statusApproved)}`}>
                          {loanCustomer.statusApproved ?? '—'}
                        </span>
                      </td>
                      <td className="amount">{loanCustomer.monthlyPayment ? fmtINR(loanCustomer.monthlyPayment) : '—'}</td>
                      <td className="amount">{loanCustomer.remainingBalance ? fmtINR(loanCustomer.remainingBalance) : '—'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => handleEditClick(loanCustomer)}
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleView(loanCustomer)}
                            title="View"
                          >
                            👁
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDelete(loanCustomer.loan_customer_id)}
                            title="Delete"
                          >
                            🗑
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

      <Loan_List_Details
        editData={editLoanCustomer}
        setEditData={setEditLoanCustomer}
        onSaved={fetchAll}
      />

      <Loan_List_View
        viewData={viewLoanCustomer}
      />
    </Layout>
  );
};

export default Loan_Details;