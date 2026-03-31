import Layout from '../../components/Layout/Layout';
import '../Dashboard/dashboard.css';

const DashboardPage = () => {
  return (
    <Layout>


    <div className="dashboard-ui">

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="greeting">
            Good morning, <span>Admin</span> 👋
          </div>
          <div className="sub">Tuesday, 31 March 2026</div>
        </div>

        <div className="top-actions">
          <div className="live">LIVE</div>
          <button className="refresh">↻ Refresh</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi blue">
          <div className="kpi-top">
            <div className="icon">👥</div>
            <span className="change up">+6.2%</span>
          </div>
          <div className="label">Total Customers</div>
          <div className="value">98</div>
          <div className="subtext">Registered borrowers</div>
        </div>

        <div className="kpi violet">
          <div className="kpi-top">
            <div className="icon">🏦</div>
            <span className="change up">+12.4%</span>
          </div>
          <div className="label">Total Loans</div>
          <div className="value">142</div>
          <div className="subtext">All time issued</div>
        </div>

        <div className="kpi green">
          <div className="kpi-top">
            <div className="icon">💰</div>
            <span className="change up">+8.1%</span>
          </div>
          <div className="label">Collected</div>
          <div className="value">₹32.4L</div>
          <div className="subtext">Recovered</div>
        </div>

        <div className="kpi red">
          <div className="kpi-top">
            <div className="icon">⏳</div>
            <span className="change down">-3.5%</span>
          </div>
          <div className="label">Pending</div>
          <div className="value">₹18.6L</div>
          <div className="subtext">Outstanding</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom">

        {/* Activity */}
        <div className="card">
          <div className="card-head">
            <span>Recent Activity</span>
          </div>

          <div className="activity">
            <div className="item">
              <span className="dot green"></span>
              <div>
                <div className="name">Ravi Kumar</div>
                <div className="desc">Paid EMI ₹8,400</div>
              </div>
              <span className="time">2 min</span>
            </div>

            <div className="item">
              <span className="dot blue"></span>
              <div>
                <div className="name">Sunita Devi</div>
                <div className="desc">Loan disbursed ₹5L</div>
              </div>
              <span className="time">18 min</span>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="card">
          <div className="card-head red">
            <span>Overdue Alerts</span>
          </div>

          <div className="overdue">
            <div className="row">
              <div>
                <div className="name">Priya Sharma</div>
                <div className="loan">#LN-0141</div>
              </div>
              <div className="amt">₹11,400</div>
            </div>

            <div className="row">
              <div>
                <div className="name">Deepak Singh</div>
                <div className="loan">#LN-0133</div>
              </div>
              <div className="amt">₹7,200</div>
            </div>
          </div>
        </div>

      </div>

    </div>


    </Layout>
  );
};

export default DashboardPage;


