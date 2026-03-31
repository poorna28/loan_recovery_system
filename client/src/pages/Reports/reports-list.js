import React, { useEffect, useRef, useState } from "react";
import "../Reports/reports.css";
import Layout from "../../components/Layout/Layout";
// import {
//   Chart,
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";

// Chart.register(
//   ArcElement,
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   Filler
// );

// ─── Data ───────────────────────────────────────────────────────────────────

const LOANS = [
  { id: "#LN-0142", customer: "Ravi Kumar",   principal: "₹2,50,000", emi: "₹8,400",  start: "Jan 2024", status: "active",  progress: 68 },
  { id: "#LN-0141", customer: "Priya Sharma", principal: "₹1,00,000", emi: "₹3,800",  start: "Feb 2024", status: "overdue", progress: 32 },
  { id: "#LN-0139", customer: "Anil Mehta",   principal: "₹75,000",   emi: "₹3,100",  start: "Nov 2023", status: "closed",  progress: 100 },
  { id: "#LN-0138", customer: "Sunita Devi",  principal: "₹5,00,000", emi: "₹15,200", start: "Mar 2024", status: "active",  progress: 18 },
  { id: "#LN-0136", customer: "Mohan Rao",    principal: "₹3,00,000", emi: "₹9,800",  start: "Oct 2023", status: "active",  progress: 55 },
];

const PAYMENTS = [
  { txn: "#TXN-8821", customer: "Ravi Kumar",   loan: "#LN-0142", amount: "₹8,400",  amountColor: "var(--green)", mode: "UPI",  modeBadge: "badge-blue",  date: "15 Jun 2024", status: "Paid",    statusBadge: "badge-active" },
  { txn: "#TXN-8820", customer: "Sunita Devi",  loan: "#LN-0138", amount: "₹15,200", amountColor: "var(--green)", mode: "Bank", modeBadge: "badge-bank",  date: "14 Jun 2024", status: "Paid",    statusBadge: "badge-active" },
  { txn: "#TXN-8819", customer: "Priya Sharma", loan: "#LN-0141", amount: "₹3,800",  amountColor: "var(--amber)", mode: "Cash", modeBadge: "badge-amber", date: "13 Jun 2024", status: "Partial", statusBadge: "badge-pending" },
  { txn: "#TXN-8818", customer: "Mohan Rao",    loan: "#LN-0136", amount: "₹9,800",  amountColor: "var(--green)", mode: "UPI",  modeBadge: "badge-blue",  date: "12 Jun 2024", status: "Paid",    statusBadge: "badge-active" },
];

const OVERDUE = [
  { id: "#LN-0141", customer: "Priya Sharma", phone: "98765 43210", amount: "₹11,400", amountColor: "var(--red)",   days: "92 days", daysColor: "var(--red)",   due: "15 Mar 2024", dot: "sev-high", label: "Critical", labelClass: "sev-text-high" },
  { id: "#LN-0133", customer: "Deepak Singh", phone: "87654 32109", amount: "₹7,200",  amountColor: "var(--amber)", days: "64 days", daysColor: "var(--amber)", due: "22 Apr 2024", dot: "sev-med",  label: "High",     labelClass: "sev-text-med"  },
  { id: "#LN-0128", customer: "Lakshmi Bai",  phone: "76543 21098", amount: "₹5,500",  amountColor: "var(--amber)", days: "38 days", daysColor: "var(--amber)", due: "08 May 2024", dot: "sev-med",  label: "Medium",   labelClass: "sev-text-med"  },
  { id: "#LN-0125", customer: "Ramesh Gupta", phone: "65432 10987", amount: "₹4,100",  amountColor: "var(--green)", days: "12 days", daysColor: "var(--green)", due: "04 Jun 2024", dot: "sev-low",  label: "Low",      labelClass: "sev-text-low"  },
];

const CUSTOMERS = [
  { name: "Ravi Kumar",   id: "CUS-001", phone: "98765 43210", loans: 3, principal: "₹6,50,000", paid: "₹4,42,000", pending: "₹2,08,000", pendingColor: "var(--amber)", progress: 68, progressClass: "green", progressColor: "var(--green)", status: "Good",    statusBadge: "badge-active"  },
  { name: "Priya Sharma", id: "CUS-002", phone: "87654 32109", loans: 1, principal: "₹1,00,000", paid: "₹32,000",   pending: "₹68,000",   pendingColor: "var(--red)",   progress: 32, progressClass: "red",   progressColor: "var(--red)",   status: "Overdue", statusBadge: "badge-overdue" },
  { name: "Anil Mehta",   id: "CUS-003", phone: "76543 21098", loans: 2, principal: "₹1,75,000", paid: "₹1,75,000", pending: "₹0",        pendingColor: "var(--muted2)",progress: 100,progressClass: "green", progressColor: "var(--green)", status: "Cleared", statusBadge: "badge-closed"  },
  { name: "Sunita Devi",  id: "CUS-004", phone: "65432 10987", loans: 1, principal: "₹5,00,000", paid: "₹90,000",   pending: "₹4,10,000", pendingColor: "var(--amber)", progress: 18, progressClass: "amber", progressColor: "var(--amber)", status: "Active",  statusBadge: "badge-active"  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusBadgeClass = (s) => {
  if (s === "active")  return "badge-active";
  if (s === "overdue") return "badge-overdue";
  if (s === "closed")  return "badge-closed";
  return "badge-pending";
};

const statusLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const progressColor = (p) => (p >= 70 ? "green" : p >= 35 ? "amber" : "red");

// ─── Sub-components ──────────────────────────────────────────────────────────

const ProgressCell = ({ value, colorClass }) => (
  <div className="progress-wrap">
    <div className="progress-label" style={{ color: `var(--${colorClass === "green" ? "green" : colorClass === "red" ? "red" : "amber"})` }}>{value}%</div>
    <div className="progress-bar">
      <div className={`progress-fill ${colorClass}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const Pagination = ({ showing, total, label }) => (
  <div className="pagination">
    <span>Showing {showing} of {total} {label}</span>
    <div className="page-btns">
      <button className="page-btn">‹</button>
      <button className="page-btn active">1</button>
      <button className="page-btn">2</button>
      <button className="page-btn">3</button>
      <button className="page-btn">›</button>
    </div>
  </div>
);

const TabSummary = () => {
  const pieRef = useRef(null);
  const barRef = useRef(null);
//   usePieChart(pieRef);
//   useBarChart(barRef);

  return (
    <>
      <div className="kpi-grid">
        {[
          { color: "blue",  label: "Total Issued",  badge: "badge-blue",  badgeText: "↑ 12%",   value: "₹48.2L", sub: "142 loans total" },
          { color: "green", label: "Active Loans",  badge: "badge-green", badgeText: "Running",  value: "89",     sub: "₹32.1L outstanding" },
          { color: "amber", label: "Closed Loans",  badge: "badge-blue",  badgeText: "Settled",  value: "41",     sub: "₹16.1L recovered" },
          { color: "red",   label: "Overdue",       badge: "badge-red",   badgeText: "⚠ Alert",  value: "12",     sub: "₹4.8L at risk" },
        ].map((k) => (
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

      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <span className="card-title">Loans by Status</span>
            <span className="card-meta">Pie breakdown</span>
          </div>
          <canvas ref={pieRef} height={200} />
        </div>
        <div className="chart-card">
          <div className="card-header">
            <span className="card-title">Monthly Loan Disbursement</span>
            <span className="card-meta">Last 6 months</span>
          </div>
          <canvas ref={barRef} height={200} />
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">All Loans</span>
          <div className="table-header-actions">
            <div className="search-box">
              🔍 <input type="text" placeholder="Search loan ID..." />
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 11, padding: "6px 12px" }}>Filter</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Principal</th>
              <th>EMI</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {LOANS.map((l) => (
              <tr key={l.id}>
                <td className="td-primary">{l.id}</td>
                <td>{l.customer}</td>
                <td className="td-amount" style={{ color: "var(--text)" }}>{l.principal}</td>
                <td className="td-amount">{l.emi}</td>
                <td className="td-mono">{l.start}</td>
                <td><span className={`badge ${statusBadgeClass(l.status)}`}>{statusLabel(l.status)}</span></td>
                <td><ProgressCell value={l.progress} colorClass={progressColor(l.progress)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination showing="1–5" total={142} label="loans" />
      </div>
    </>
  );
};

const TabPayments = () => {
  const lineRef = useRef(null);
//   useLineChart(lineRef);

  return (
    <>
      <div className="kpi-grid">
        {[
          { color: "green", label: "Total Collected", badge: "badge-green", badgeText: "↑ 8%",  value: "₹12.4L", sub: "This month" },
          { color: "blue",  label: "Transactions",    badge: "badge-blue",  badgeText: "Count", value: "386",     sub: "Across all loans" },
          { color: "amber", label: "Avg Payment",     badge: "badge-amber", badgeText: "Avg",   value: "₹3,212",  sub: "Per transaction" },
          { color: "red",   label: "Missed EMIs",     badge: "badge-red",   badgeText: "⚠",     value: "23",      sub: "₹78,400 pending" },
        ].map((k) => (
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

      <div className="charts-row">
        <div className="chart-card wide">
          <div className="card-header">
            <span className="card-title">Payment Collections — Daily (Last 30 days)</span>
            <span className="card-meta">GET /api/reports/payments</span>
          </div>
          <canvas ref={lineRef} height={120} />
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="card-title">Payment Transactions</span>
          <div className="table-header-actions">
            <div className="search-box">🔍 <input type="text" placeholder="Search..." /></div>
            <button className="btn btn-ghost" style={{ fontSize: 11, padding: "6px 12px" }}>⬇ Export</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Customer</th>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p) => (
              <tr key={p.txn}>
                <td className="td-primary">{p.txn}</td>
                <td>{p.customer}</td>
                <td className="td-link">{p.loan}</td>
                <td className="td-amount" style={{ color: p.amountColor }}>{p.amount}</td>
                <td><span className={`badge ${p.modeBadge}`}>{p.mode}</span></td>
                <td className="td-mono">{p.date}</td>
                <td><span className={`badge ${p.statusBadge}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination showing="1–4" total={386} label="transactions" />
      </div>
    </>
  );
};

const TabOverdue = () => (
  <>
    <div className="kpi-grid">
      {[
        { color: "red",   label: "Total Overdue",  badge: "badge-red",   badgeText: "Critical", value: "12",     sub: "Loans overdue today" },
        { color: "red",   label: "At Risk Amount", badge: "badge-red",   badgeText: "₹",        value: "₹4.8L",  sub: "Total overdue principal" },
        { color: "amber", label: "30+ Days",       badge: "badge-amber", badgeText: "Watch",    value: "7",      sub: "Moderate risk" },
        { color: "red",   label: "90+ Days",       badge: "badge-red",   badgeText: "NPA Risk", value: "3",      sub: "Immediate action needed" },
      ].map((k) => (
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
        <span className="card-title">Overdue Loans — next_payment_due &lt; today</span>
        <div className="table-header-actions">
          <div className="search-box">🔍 <input type="text" placeholder="Search..." /></div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Overdue Amount</th>
            <th>Days Overdue</th>
            <th>Next Due Date</th>
            <th>Severity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {OVERDUE.map((o) => (
            <tr key={o.id}>
              <td className="td-primary">{o.id}</td>
              <td>{o.customer}</td>
              <td className="td-mono">{o.phone}</td>
              <td className="td-amount" style={{ color: o.amountColor }}>{o.amount}</td>
              <td className="td-mono" style={{ color: o.daysColor }}>{o.days}</td>
              <td className="td-mono">{o.due}</td>
              <td>
                <div className="severity">
                  <div className={`severity-dot ${o.dot}`} />
                  <span className={o.labelClass}>{o.label}</span>
                </div>
              </td>
              <td>
                <button className="btn btn-ghost" style={{ fontSize: 10, padding: "5px 10px" }}>
                  Send Reminder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination showing="1–4" total={12} label="overdue loans" />
    </div>
  </>
);

const TabCustomer = () => (
  <>
    <div className="summary-row">
      {[
        { icon: "👥", iconClass: "icon-blue",  label: "Total Customers", val: "98", valClass: "val-blue"  },
        { icon: "✅", iconClass: "icon-green", label: "Good Standing",   val: "79", valClass: "val-green" },
        { icon: "⚠️", iconClass: "icon-red",   label: "Defaulters",      val: "19", valClass: "val-red"   },
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
          <div className="search-box">🔍 <input type="text" placeholder="Search customer..." /></div>
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
          {CUSTOMERS.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="customer-name">{c.name}</div>
                <div className="customer-id">{c.id}</div>
              </td>
              <td className="td-mono">{c.phone}</td>
              <td style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent2)" }}>{c.loans}</td>
              <td className="td-amount" style={{ color: "var(--text)" }}>{c.principal}</td>
              <td className="td-amount" style={{ color: "var(--green)" }}>{c.paid}</td>
              <td className="td-amount" style={{ color: c.pendingColor }}>{c.pending}</td>
              <td>
                <ProgressCell value={c.progress} colorClass={c.progressClass} />
              </td>
              <td><span className={`badge ${c.statusBadge}`}>{c.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination showing="1–4" total={98} label="customers" />
    </div>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { id: "summary",  label: "Loan Summary" },
  { id: "payments", label: "Payments"     },
  { id: "overdue",  label: "Overdue Loans"},
  { id: "customer", label: "Customer-wise"},
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const renderPanel = () => {
    switch (activeTab) {
      case "summary":  return <TabSummary />;
      case "payments": return <TabPayments />;
      case "overdue":  return <TabOverdue />;
      case "customer": return <TabCustomer />;
      default:         return null;
    }
  };

  return (
    <Layout>
    <div className="reports-body">
      <div className="reports-layout">

        {/* Main */}
        <main className="reports-main">
          {/* Header */}
          <div className="page-header">
            <div>
              <div className="page-title">Reports</div>
              <div className="page-subtitle">GET /api/reports — Last updated just now</div>
            </div>
            <div className="header-actions">
              <div className="date-filter">
                📅&nbsp;
                <select onChange={(e) => console.log("Filter:", e.target.value)}>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <button className="btn btn-ghost">⬇ Export PDF</button>
              <button className="btn btn-primary">⬇ Export Excel</button>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="tab-nav">
            {TABS.map((t) => (
              <div
                key={t.id}
                className={`tab${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
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