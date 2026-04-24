import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import './customers.css';
import Layout from '../../components/Layout/Layout';
import Customer_details from './customer_details';
import Customer_list_view from './customer_list_view';
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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoans, setCustomerLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'firstName',
    sortOrder: 'asc',
    page: 1,
    limit: 50,
    profileStatus: '',
    employmentStatus: ''
  });
  const [kpiData, setKpiData] = useState({
    total: 0,
    active: 0,
    employed: 0,
    avgCredit: 0
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = buildUrl('customers', filters);
      const res = await api.get(url);
      const customerList = res.data.customers || [];
      setCustomers(customerList);

      // Calculate KPIs
      const total = customerList.length;
      const active = customerList.filter(c => c.profileStatus === 'Active').length;
      const employed = customerList.filter(c => c.employmentStatus === 'Employed').length;
      const avgCredit = customerList.length > 0
        ? Math.round(customerList.reduce((sum, c) => sum + (Number(c.creditScore) || 0), 0) / customerList.length)
        : 0;

      setKpiData({ total, active, employed, avgCredit });
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      toast.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleEdit = (customer) => {
    fetchCustomerById(customer.customer_id);
  };

  const openViewCustomer = async (customer_id) => {
    try {
      const res = await api.get(`/customers/${customer_id}`);
      setViewData(res.data);
      const modalEl = document.getElementById('viewCustomerModal');
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    } catch (err) {
      console.error("Error fetching customer:", err);
      toast.error("Failed to load customer details");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        setIsLoading(true);
        await api.delete(`/customers/${id}`);
        setCustomers(prev => prev.filter(c => c.customer_id !== id));
        toast.success("Customer deleted successfully");
      } catch (err) {
        console.error('Error deleting customer:', err);
        toast.error(err.response?.data?.message || "Failed to delete customer");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchCustomerById = async (customerId) => {
    try {
      const res = await api.get(`/customers/${customerId}`);
      setEditData(res.data);
      const modalEl = document.getElementById('addCustomerModal');
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    } catch (err) {
      console.error("Edit API error:", err);
      toast.error("Failed to fetch customer details");
    }
  };

  const openLoansModal = async (customer_id) => {
    setSelectedCustomer(customer_id);
    try {
      const loansFilters = { page: 1, limit: 100, customerId: customer_id };
      const url = buildUrl(`loan_customers/customer/${customer_id}`, loansFilters);
      const res = await api.get(url);
      setCustomerLoans(res.data.loans || []);
      const modalEl = document.getElementById('customerLoansModal');
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      toast.error('Failed to load loans');
    }
  };

  const kpiCards = [
    {
      color: 'blue',
      icon: '👥',
      label: 'Total Customers',
      value: kpiData.total,
      subtext: 'Registered'
    },
    {
      color: 'green',
      icon: '✓',
      label: 'Active',
      value: kpiData.active,
      subtext: `${Math.round((kpiData.active / (kpiData.total || 1)) * 100)}% active`
    },
    {
      color: 'violet',
      icon: '💼',
      label: 'Employed',
      value: kpiData.employed,
      subtext: 'Working'
    },
    {
      color: 'orange',
      icon: '📊',
      label: 'Avg Credit Score',
      value: kpiData.avgCredit,
      subtext: 'Portfolio average'
    }
  ];

  return (
    <Layout>
      <div className="customers-ui">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Customers</h2>
          </div>
          <div className="topbar-right">
            <button
              className="btn-add"
              onClick={() => {
                setEditData(null);
                const modalEl = document.getElementById('addCustomerModal');
                if (modalEl) {
                  const modal = new window.bootstrap.Modal(modalEl);
                  modal.show();
                }
              }}
            >
              ➕ Add Customer
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          {kpiCards.map((k) => (
            <div key={k.label} className={`kpi ${k.color}`}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{isLoading ? '—' : k.value}</div>
              <div className="kpi-subtext">{k.subtext}</div>
            </div>
          ))}
        </div>

        {/* Customers Table Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Customer List</div>
            <div className="card-controls">
              <span style={{ fontSize: '11px', color: '#7880a0' }}>
                {isLoading ? 'Loading...' : `${customers.length} customers`}
              </span>
            </div>
          </div>

          <div className="card-body">
            {isLoading ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Income</th>
                    <th>Credit</th>
                    <th>Loans</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="loading-row">
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '120px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '150px' }} /></td>
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton" style={{ width: '50px' }} /></td>
                      <td><div className="skeleton" style={{ width: '100px' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : customers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No customers found. Add one to get started.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Income</th>
                    <th>Credit</th>
                    <th>Loans</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>
                      <td>{customer.firstName} {customer.lastName}</td>
                      <td>{customer.phoneNumber}</td>
                      <td>{customer.email}</td>
                      <td>
                        <span className={`status-badge ${customer.profileStatus?.toLowerCase()}`}>
                          {customer.profileStatus}
                        </span>
                      </td>
                      <td>{fmtINR(customer.annualIncome)}</td>
                      <td>{customer.creditScore || '—'}</td>
                      <td>
                        {customer.loan_count > 0 ? (
                          <button
                            className="btn-icon"
                            onClick={() => openLoansModal(customer.customer_id)}
                            style={{ background: 'transparent', border: 'none', color: '#4f8dff', cursor: 'pointer' }}
                          >
                            {customer.loan_count} 🔗
                          </button>
                        ) : (
                          <span style={{ color: '#7880a0' }}>0</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(customer)}
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => openViewCustomer(customer.customer_id)}
                            title="View"
                          >
                            👁
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDelete(customer.customer_id)}
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

      {/* Add/Edit Modal */}
      <Customer_details editData={editData} setEditData={setEditData} onSaveSuccess={fetchCustomers} />

      {/* View Modal */}
      <Customer_list_view viewData={viewData} />

      {/* Customer Loans Modal */}
      <div className="modal fade" id="customerLoansModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                💰 Loans for {selectedCustomer}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {customerLoans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#7880a0' }}>
                  <p>No loans found for this customer.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#7880a0', fontWeight: 600 }}>Loan ID</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#7880a0', fontWeight: 600 }}>Amount</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#7880a0', fontWeight: 600 }}>Purpose</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#7880a0', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#7880a0', fontWeight: 600 }}>Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoans.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '10px', color: '#eceef6' }}>{l.loan_id}</td>
                        <td style={{ padding: '10px', color: '#18d88b', fontWeight: 600 }}>{fmtINR(l.loan_amount)}</td>
                        <td style={{ padding: '10px', color: '#eceef6' }}>{l.loan_purpose}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: l.status_approved === 'ACTIVE' ? 'rgba(24,216,139,0.15)' : 'rgba(79,141,255,0.15)',
                            color: l.status_approved === 'ACTIVE' ? '#18d88b' : '#4f8dff'
                          }}>
                            {l.status_approved}
                          </span>
                        </td>
                        <td style={{ padding: '10px', color: '#eceef6' }}>{l.loan_term} mo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
