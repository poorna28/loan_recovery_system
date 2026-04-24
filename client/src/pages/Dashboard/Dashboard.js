import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import '../Dashboard/dashboard.css';
import api from '../../services/api';import { buildUrl } from '../../utils/queryBuilder';
// ─── Helpers ──────────────────────────── ──────────────────────────── ──────────

const fmtINR = (val) => {
  const n = Number(val || 0);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${n.toLocaleString('en-IN')}`;
  return `₹${n}`;
};

const timeAgo = (minutes) => {
  const m = Math.max(0, Number(minutes || 0));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getTodayStr = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const statusColor = (status = '') => {
  const normalizedStatus = (status || '').toUpperCase();
  switch (normalizedStatus) {
    case 'ACTIVE': return 'green';
    case 'APPROVED': return 'blue';
    case 'PENDING': return 'violet';
    case 'REJECTED': return 'red';
    default: return 'blue';
  }
};

// ─── DashboardPage ────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardParams] = useState({
    dateRange: 'all',
    limit: 100,
    page: 1
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildUrl('/dashboard', dashboardParams);
      const res = await api.get(url);
      setData(res.data || {});
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [dashboardParams]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Derived values ────────────────────────────────────────────────────────
  const kpis = data?.kpis || {};
  const recentPayments = data?.recentPayments || [];
  const overdueLoans = data?.overdueLoans || [];
  const loanStatusBreakdown = data?.loanStatusBreakdown || [];
  const monthlyTrend = data?.monthlyTrend || [];

  const kpiCards = [
    {
      color: 'blue',
      icon: '👥',
      label: 'Total Customers',
      value: loading ? '—' : (kpis.total_customers ?? 0),
      subtext: 'Registered borrowers',
      change: null,
    },
    {
      color: 'violet',
      icon: '🏦',
      label: 'Total Loans',
      value: loading ? '—' : (kpis.total_loans ?? 0),
      subtext: `${kpis.active_loans ?? 0} active`,
      change: null,
    },
    {
      color: 'green',
      icon: '💰',
      label: 'Collected',
      value: loading ? '—' : fmtINR(kpis.total_collected),
      subtext: 'Total recovered',
      change: null,
    },
    {
      color: 'red',
      icon: '⏳',
      label: 'Pending',
      value: loading ? '—' : fmtINR(kpis.total_pending),
      subtext: `${kpis.overdue_count ?? 0} overdue`,
      change: null,
    },
  ];

  // Max collected for trend bar scaling
  const maxCollected = monthlyTrend.length > 0 
    ? Math.max(...monthlyTrend.map(m => Number(m.collected || 0)), 1)
    : 1;

  return (
    <Layout>
      <div className="dashboard-ui">

        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="greeting">
              {getGreeting()}, <span>Admin</span> 👋
            </div>
            <div className="sub">{getTodayStr()}</div>
          </div>
          <div className="top-actions">
            {!loading && <div className="live">LIVE</div>}
            <button
              className="refresh"
              onClick={fetchDashboard}
              disabled={loading}
            >
              {loading ? '...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="alert alert-danger mb-3"
            style={{ borderRadius: 8, padding: '10px 16px' }}
          >
            {error}{' '}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchDashboard}
            >
              Retry
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-grid">
          {kpiCards.map((k) => (
            <div key={k.label} className={`kpi ${k.color}`}>
              <div className="kpi-top">
                <div className="icon">{k.icon}</div>
              </div>
              <div className="label">{k.label}</div>
              <div className="value">
                {loading ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 60,
                      height: 28,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      verticalAlign: 'middle',
                    }}
                  />
                ) : k.value}
              </div>
              <div className="subtext">{k.subtext}</div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bottom">

          {/* Recent Activity — from real loan_payments */}
          <div className="card">
            <div className="card-head">
              <span>Recent Activity</span>
              {lastUpdated && (
                <span style={{ fontSize: 11, opacity: 0.5 }}>
                  {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <div className="activity">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="item">
                    <span className="dot blue" />
                    <div>
                      <div
                        className="name"
                        style={{
                          width: 100,
                          height: 12,
                          background: 'rgba(0,0,0,0.08)',
                          borderRadius: 4,
                          marginBottom: 4,
                        }}
                      />
                      <div
                        className="desc"
                        style={{
                          width: 140,
                          height: 10,
                          background: 'rgba(0,0,0,0.05)',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <span className="time">—</span>
                  </div>
                ))
              ) : recentPayments.length === 0 ? (
                <div style={{ padding: '12px 0', color: '#999', fontSize: 13 }}>
                  No payments recorded yet.
                </div>
              ) : (
                recentPayments.map((p) => (
                  <div key={p.id} className="item">
                    <span className="dot green" />
                    <div>
                      <div className="name">{p.customer_name || 'Unknown'}</div>
                      <div className="desc">
                        Paid {fmtINR(p.amount_paid)} — {p.loan_id}
                        {p.payment_method ? ` · ${p.payment_method}` : ''}
                      </div>
                    </div>
                    <span className="time">{timeAgo(p.minutes_ago)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Alerts — from real loan_customer */}
          <div className="card">
            <div className="card-head red">
              <span>Overdue Alerts</span>
              {!loading && overdueLoans.length > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {overdueLoans.length}
                </span>
              )}
            </div>

            <div className="overdue">
              {loading ? (
                [1, 2].map((i) => (
                  <div key={i} className="row">
                    <div>
                      <div
                        className="name"
                        style={{
                          width: 110,
                          height: 12,
                          background: 'rgba(0,0,0,0.08)',
                          borderRadius: 4,
                          marginBottom: 4,
                        }}
                      />
                      <div
                        className="loan"
                        style={{
                          width: 70,
                          height: 10,
                          background: 'rgba(0,0,0,0.05)',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div className="amt">—</div>
                  </div>
                ))
              ) : overdueLoans.length === 0 ? (
                <div style={{ padding: '12px 0', color: '#16a34a', fontSize: 13 }}>
                  ✅ No overdue loans!
                </div>
              ) : (
                overdueLoans.map((o, i) => (
                  <div key={i} className="row">
                    <div>
                      <div className="name">{o.customer_name || 'Unknown'}</div>
                      <div className="loan">
                        {o.loan_id}
                        {o.days_overdue > 0 && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 10,
                              color:
                                o.days_overdue >= 90
                                  ? '#ef4444'
                                  : o.days_overdue >= 30
                                    ? '#f97316'
                                    : '#eab308',
                              fontWeight: 600,
                            }}
                          >
                            {o.days_overdue}d overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="amt"
                      style={{
                        color:
                          o.days_overdue >= 90
                            ? '#ef4444'
                            : o.days_overdue >= 30
                              ? '#f97316'
                              : 'inherit',
                      }}
                    >
                      {fmtINR(o.remaining_balance)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Loan Status Breakdown + Monthly Trend — bonus section */}
        {!loading && (loanStatusBreakdown.length > 0 || monthlyTrend.length > 0) && (
          <div className="bottom" style={{ marginTop: 0 }}>

            {/* Loan Status Mini Bars */}
            <div className="card">
              <div className="card-head">
                <span>Loans by Status</span>
              </div>
              <div style={{ padding: '4px 0' }}>
                {loanStatusBreakdown.map((s) => {
                  const total = loanStatusBreakdown.reduce((a, b) => a + Number(b.count), 0);
                  const pct = total > 0 ? Math.round((Number(s.count) / total) * 100) : 0;
                  const color = statusColor(s.status);
                  const barColors = {
                    green: '#16a34a',
                    blue: '#2563eb',
                    violet: '#7c3aed',
                    red: '#dc2626',
                  };
                  return (
                    <div key={s.status} style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          marginBottom: 3,
                          opacity: 0.8,
                          color:  '#fff',
                        }}
                      >
                        <span>{s.status}</span>
                        <span style={{ fontWeight: 600 }}>
                          {s.count} ({pct}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: 'rgba(0,0,0,0.07)',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: barColors[color] || '#2563eb',
                            borderRadius: 3,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Collection Trend */}
            <div className="card">
              <div className="card-head">
                <span>Monthly Collections</span>
                <span style={{ fontSize: 11, opacity: 0.5 }}>Last 6 months</span>
              </div>
              {monthlyTrend.length === 0 ? (
                <div style={{ fontSize: 13, color: '#999', padding: '8px 0' }}>
                  No payment data yet.
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    height: 80,
                    paddingTop: 8,
                  }}
                >
                  {monthlyTrend.map((m, i) => {
                    const pct = Math.max(
                      (Number(m.collected) / maxCollected) * 100,
                      4
                    );
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: '#6b7280',
                            fontWeight: 600,
                          }}
                        >
                          {fmtINR(m.collected)}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            height: `${pct}%`,
                            background: '#2563eb',
                            borderRadius: '4px 4px 0 0',
                            minHeight: 4,
                            opacity: 0.7 + (i / monthlyTrend.length) * 0.3,
                            transition: 'height 0.6s ease',
                          }}
                        />
                        <span style={{ fontSize: 10, color: '#9ca3af' }}>
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};

export default DashboardPage;