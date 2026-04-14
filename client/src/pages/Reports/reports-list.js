import React, { useEffect, useRef, useState, useCallback } from "react";
import "../Reports/reports.css";
import Layout from "../../components/Layout/Layout";
import api from "../../services/api";
import { buildUrl } from "../../utils/queryBuilder";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtINR = (val) => {
  const n = Number(val || 0);
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${n.toLocaleString('en-IN')}`;
  return `₹${n}`;
};

const statusBadgeClass = (s = "") => {
  const lower = s.toLowerCase();
  if (lower === "active")   return "badge-active";
  if (lower === "overdue")  return "badge-overdue";
  if (lower === "closed" || lower === "rejected") return "badge-closed";
  if (lower === "approved") return "badge-active";
  return "badge-pending";
};

const statusLabel = (s = "") =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const progressColorClass = (p) => (p >= 70 ? "green" : p >= 35 ? "amber" : "red");

const severityFromDays = (days) => {
  if (days >= 90) return { dot: "sev-high", label: "Critical", labelClass: "sev-text-high" };
  if (days >= 30) return { dot: "sev-med",  label: "High",     labelClass: "sev-text-med"  };
  if (days >= 15) return { dot: "sev-med",  label: "Medium",   labelClass: "sev-text-med"  };
  return            { dot: "sev-low",  label: "Low",      labelClass: "sev-text-low"  };
};

const customerStatusBadge = (status = "") => {
  if (!status) return "badge-pending";
  const s = status.toUpperCase();
  if (s === "ACTIVE")   return "badge-active";
  if (s === "REJECTED") return "badge-closed";
  if (s === "APPROVED") return "badge-active";
  return "badge-pending";
};

// ─── Shared Sub-components ────────────────────────────────────────────────────

const ProgressCell = ({ value, colorClass }) => (
  <div className="progress-wrap">
    <div
      className="progress-label"
      style={{
        color: `var(--${colorClass === "green" ? "green" : colorClass === "red" ? "red" : "amber"})`,
      }}
    >
      {value}%
    </div>
    <div className="progress-bar">
      <div className={`progress-fill ${colorClass}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

const Pagination = ({ total, label }) => (
  <div className="pagination">
    <span>Showing {total} {label}</span>
    <div className="page-btns">
      <button className="page-btn active">1</button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border spinner-border-sm me-2" role="status" />
    <span>Loading...</span>
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="alert alert-danger m-3">{msg}</div>
);

// ─── TAB 1: Loan Summary ──────────────────────────────────────────────────────

const TabSummary = ({ data, loading, error }) => {
  const [search, setSearch] = useState("");

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMsg msg={error} />;
  if (!data)   return null;

  const { kpis, loans = [] } = data;

  const cards = [
    {
      color: "blue",
      label: "Total Amount Issued",
      badge: "badge-blue",
      badgeText: `${kpis.total_loans || 0} loans`,
      value: fmtINR(kpis.total_issued),
      sub: `${kpis.total_loans || 0} loans total`,
    },
    {
      color: "green",
      label: "Active Loans",
      badge: "badge-green",
      badgeText: "Running",
      value: kpis.active_loans || 0,
      sub: `${fmtINR(kpis.outstanding)} outstanding`,
    },
    {
      color: "amber",
      label: "Approved Loans",
      badge: "badge-blue",
      badgeText: "Awaiting",
      value: kpis.approved_loans || 0,
      sub: "Awaiting activation",
    },
    {
      color: "red",
      label: "Pending Loans",
      badge: "badge-red",
      badgeText: "⚠ Alert",
      value: kpis.pending_loans || 0,
      sub: "Awaiting approval",
    },
  ];

  const filtered = loans.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (l.loan_id || "").toLowerCase().includes(q) ||
      (l.customer_name || "").toLowerCase().includes(q)
    );
  });

  // Compute repayment progress per loan: (loan_amount - remaining_balance) / loan_amount * 100
  const withProgress = filtered.map((l) => {
    const principal = Number(l.loan_amount || 0);
    const remaining = Number(l.remaining_balance || 0);
    let progress =
      principal > 0 ? Math.round(((principal - remaining) / principal) * 100) : 0;
    // Ensure progress is a valid number between 0-100
    progress = Number.isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
    return { ...l, progress };
  });

  return (
    <>
      <div className="kpi-grid">
        {cards.map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <span className={`kpi-badge ${k.badge}`}>{k.badgeText}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">All Loans</span>
          <div className="table-header-actions">
            <div className="search-box">
              🔍{" "}
              <input
                type="text"
                placeholder="Search loan ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Loan Amount</th>
              <th>Interest Rate</th>
              <th>Application Date</th>
              <th>Status</th>
              <th>Repayment</th>
            </tr>
          </thead>
          <tbody>
            {withProgress.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No loans found.
                </td>
              </tr>
            ) : (
              withProgress.map((l) => (
                <tr key={l.id}>
                  <td className="td-primary">{l.loan_id}</td>
                  <td>{l.customer_name || "—"}</td>
                  <td className="td-amount">{fmtINR(l.loan_amount)}</td>
                  <td className="td-amount">{l.interest_rate}%</td>
                  <td className="td-mono">{l.application_date || "—"}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(l.status_approved)}`}>
                      {statusLabel(l.status_approved)}
                    </span>
                  </td>
                  <td>
                    <ProgressCell
                      value={l.progress}
                      colorClass={progressColorClass(l.progress)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination total={filtered.length} label="loans" />
      </div>
    </>
  );
};

// ─── TAB 2: Payments ──────────────────────────────────────────────────────────

const PAYMENT_METHOD_BADGE = {
  CASH:     "badge-amber",
  CHECK:    "badge-blue",
  TRANSFER: "badge-bank",
  CARD:     "badge-blue",
  ONLINE:   "badge-blue",
};

const TabPayments = ({ data, loading, error }) => {
  const [search, setSearch] = useState("");

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMsg msg={error} />;
  if (!data)   return null;

  const { kpis, payments = [] } = data;

  const cards = [
    {
      color: "green",
      label: "Total Collected",
      badge: "badge-green",
      badgeText: "All time",
      value: fmtINR(kpis.total_collected),
      sub: `${kpis.total_transactions || 0} transactions`,
    },
    {
      color: "blue",
      label: "Transactions",
      badge: "badge-blue",
      badgeText: "Count",
      value: kpis.total_transactions || 0,
      sub: "Across all loans",
    },
    {
      color: "amber",
      label: "Avg Payment",
      badge: "badge-amber",
      badgeText: "Avg",
      value: fmtINR(kpis.avg_payment),
      sub: "Per transaction",
    },
    {
      color: "red",
      label: "Overdue Active Loans",
      badge: "badge-red",
      badgeText: "⚠",
      value: kpis.missed_emis || 0,
      sub: "Next payment past due",
    },
  ];

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.loan_id || "").toLowerCase().includes(q) ||
      (p.customer_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="kpi-grid">
        {cards.map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <span className={`kpi-badge ${k.badge}`}>{k.badgeText}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">Payment Transactions</span>
          <div className="table-header-actions">
            <div className="search-box">
              🔍{" "}
              <input
                type="text"
                placeholder="Search loan ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Customer</th>
              <th>Loan ID</th>
              <th>Amount Paid</th>
              <th>Mode</th>
              <th>Payment Date</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No payment transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td className="td-primary">#{p.id}</td>
                  <td>{p.customer_name || "—"}</td>
                  <td className="td-link">{p.loan_id}</td>
                  <td className="td-amount" style={{ color: "var(--green)" }}>
                    {fmtINR(p.amount_paid)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        PAYMENT_METHOD_BADGE[p.payment_method] || "badge-pending"
                      }`}
                    >
                      {p.payment_method}
                    </span>
                  </td>
                  <td className="td-mono">{p.payment_date || "—"}</td>
                  <td className="td-amount" style={{ color: "var(--amber)" }}>
                    {fmtINR(p.remaining_balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination total={filtered.length} label="transactions" />
      </div>
    </>
  );
};

// ─── TAB 3: Overdue Loans ─────────────────────────────────────────────────────

const TabOverdue = ({ data, loading, error }) => {
  const [search, setSearch] = useState("");

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMsg msg={error} />;
  if (!data)   return null;

  const { kpis, loans = [] } = data;

  const cards = [
    {
      color: "red",
      label: "Total Overdue",
      badge: "badge-red",
      badgeText: "Critical",
      value: kpis.total_overdue || 0,
      sub: "Loans overdue today",
    },
    {
      color: "red",
      label: "At Risk Amount",
      badge: "badge-red",
      badgeText: "₹",
      value: fmtINR(kpis.at_risk_amount),
      sub: "Total overdue balance",
    },
    {
      color: "amber",
      label: "30+ Days",
      badge: "badge-amber",
      badgeText: "Watch",
      value: kpis.over_30 || 0,
      sub: "Moderate risk",
    },
    {
      color: "red",
      label: "90+ Days",
      badge: "badge-red",
      badgeText: "NPA Risk",
      value: kpis.over_90 || 0,
      sub: "Immediate action needed",
    },
  ];

  const filtered = loans.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.loan_id || "").toLowerCase().includes(q) ||
      (o.customer_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="kpi-grid">
        {cards.map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <span className={`kpi-badge ${k.badge}`}>{k.badgeText}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">
            Overdue Loans — next_payment_due &lt; today
          </span>
          <div className="table-header-actions">
            <div className="search-box">
              🔍{" "}
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Days Overdue</th>
              <th>Next Due Date</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No overdue loans. 🎉
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const days = Number(o.days_overdue || 0);
                const sev = severityFromDays(days);
                const amtColor =
                  days >= 90
                    ? "var(--red)"
                    : days >= 30
                    ? "var(--amber)"
                    : "var(--green)";
                const daysColor = amtColor;
                return (
                  <tr key={o.id}>
                    <td className="td-primary">{o.loan_id}</td>
                    <td>{o.customer_name || "—"}</td>
                    <td className="td-mono">{o.phone || "—"}</td>
                    <td className="td-amount" style={{ color: amtColor }}>
                      {fmtINR(o.remaining_balance)}
                    </td>
                    <td className="td-mono" style={{ color: daysColor }}>
                      {days} days
                    </td>
                    <td className="td-mono">{o.next_payment_due || "—"}</td>
                    <td>
                      <div className="severity">
                        <div className={`severity-dot ${sev.dot}`} />
                        <span className={sev.labelClass}>{sev.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <Pagination total={filtered.length} label="overdue loans" />
      </div>
    </>
  );
};

// ─── TAB 4: Customer-wise ─────────────────────────────────────────────────────

const TabCustomer = ({ data, loading, error }) => {
  const [search, setSearch] = useState("");

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMsg msg={error} />;
  if (!data)   return null;

  const { kpis, customers = [] } = data;

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.customer_name || "").toLowerCase().includes(q) ||
      (c.customer_id || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="summary-row">
        {[
          {
            icon: "👥",
            iconClass: "icon-blue",
            label: "Total Customers",
            val: kpis.total_customers || 0,
            valClass: "val-blue",
          },
          {
            icon: "✅",
            iconClass: "icon-green",
            label: "Good Standing",
            val: kpis.good_standing || 0,
            valClass: "val-green",
          },
          {
            icon: "⚠️",
            iconClass: "icon-red",
            label: "Defaulters",
            val: kpis.defaulters || 0,
            valClass: "val-red",
          },
        ].map((s) => (
          <div className="summary-item" key={s.label}>
            <div className={`summary-icon ${s.iconClass}`}>{s.icon}</div>
            <div>
              <div className="summary-label">{s.label}</div>
              <div className={`summary-val ${s.valClass}`}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">Customer-wise Loan Report</span>
          <div className="table-header-actions">
            <div className="search-box">
              🔍{" "}
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Loans</th>
              <th>Total Principal</th>
              <th>Total Paid</th>
              <th>Pending</th>
              <th>Collection %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const pct = Number(c.collection_pct || 0);
                const pendingAmt = Number(c.pending_amount || 0);
                const pendingColor =
                  pendingAmt === 0
                    ? "var(--muted2)"
                    : pct >= 70
                    ? "var(--amber)"
                    : "var(--red)";

                return (
                  <tr key={c.customer_id}>
                    <td>
                      <div className="customer-name">{c.customer_name}</div>
                      <div className="customer-id">{c.customer_id}</div>
                    </td>
                    <td className="td-mono">{c.phone || "—"}</td>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "var(--accent2)",
                      }}
                    >
                      {c.total_loans}
                    </td>
                    <td className="td-amount" style={{ color: "var(--text)" }}>
                      {fmtINR(c.total_principal)}
                    </td>
                    <td className="td-amount" style={{ color: "var(--green)" }}>
                      {fmtINR(c.total_paid)}
                    </td>
                    <td className="td-amount" style={{ color: pendingColor }}>
                      {fmtINR(c.pending_amount)}
                    </td>
                    <td>
                      <ProgressCell
                        value={pct}
                        colorClass={progressColorClass(pct)}
                      />
                    </td>
                    <td>
                      <span className={`badge ${customerStatusBadge(c.status)}`}>
                        {statusLabel(c.status || "N/A")}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <Pagination total={filtered.length} label="customers" />
      </div>
    </>
  );
};

// ─── Main Reports Component ───────────────────────────────────────────────────

const TABS = [
  { id: "summary",  label: "Loan Summary",   endpoint: "/reports/summary"  },
  { id: "payments", label: "Payments",        endpoint: "/reports/payments" },
  { id: "overdue",  label: "Overdue Loans",   endpoint: "/reports/overdue"  },
  { id: "customer", label: "Customer-wise",   endpoint: "/reports/customers"},
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 100
  });

  // Per-tab state: { data, loading, error }
  const [tabState, setTabState] = useState({
    summary:  { data: null, loading: false, error: null },
    payments: { data: null, loading: false, error: null },
    overdue:  { data: null, loading: false, error: null },
    customer: { data: null, loading: false, error: null },
  });

  const fetchTab = useCallback(async (tabId) => {
    const tab = TABS.find((t) => t.id === tabId);
    if (!tab) return;

    // Don't re-fetch if we already have data
    if (tabState[tabId].data) return;

    setTabState((prev) => ({
      ...prev,
      [tabId]: { ...prev[tabId], loading: true, error: null },
    }));

    try {
      const url = buildUrl(tab.endpoint, reportFilters);
      const res = await api.get(url);
      setTabState((prev) => ({
        ...prev,
        [tabId]: { data: res.data, loading: false, error: null },
      }));
    } catch (err) {
      console.error(`❌ Failed to fetch ${tabId} report:`, err);
      setTabState((prev) => ({
        ...prev,
        [tabId]: {
          data: null,
          loading: false,
          error: err.response?.data?.message || "Failed to load data.",
        },
      }));
    }
  }, [tabState, reportFilters]);

  // Fetch on tab switch
  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Also fetch summary immediately on mount
  useEffect(() => {
    fetchTab("summary");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Force refresh current tab
  const handleRefresh = () => {
    setTabState((prev) => ({
      ...prev,
      [activeTab]: { data: null, loading: false, error: null },
    }));
    // useEffect will re-trigger on next render because data is now null
    setTimeout(() => fetchTab(activeTab), 0);
  };

  const { data, loading, error } = tabState[activeTab];

  const renderPanel = () => {
    switch (activeTab) {
      case "summary":  return <TabSummary  data={data} loading={loading} error={error} />;
      case "payments": return <TabPayments data={data} loading={loading} error={error} />;
      case "overdue":  return <TabOverdue  data={data} loading={loading} error={error} />;
      case "customer": return <TabCustomer data={data} loading={loading} error={error} />;
      default:         return null;
    }
  };

  return (
    <Layout>
      <div className="reports-body">
        <div className="reports-layout">
          <main className="reports-main">

            {/* Header */}
            <div className="page-header">
              <div>
                <div className="page-title">Reports</div>
                <div className="page-subtitle">
                  Live data from your loan system
                </div>
              </div>
              <div className="header-actions">
                <button
                  className="btn btn-ghost"
                  onClick={handleRefresh}
                  title="Refresh current tab"
                >
                  ↺ Refresh
                </button>
              </div>
            </div>

            {/* Tab Nav */}
            <div className="tab-nav">
              {TABS.map((t) => (
                <div
                  key={t.id}
                  className={`tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => handleTabChange(t.id)}
                >
                  {t.label}
                </div>
              ))}
            </div>

            {/* Active Panel */}
            {renderPanel()}

          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;