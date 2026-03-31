import { useState } from 'react';
import '../../App.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // default collapsed
  const [hovered, setHovered] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleMouseEnter = () => {
    if (collapsed) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      setHovered(false);
    }
  };

  const actualExpanded = !collapsed || hovered;

  return (
    <aside
      className={`sidebar-fixed ${actualExpanded ? '' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="btn btn-sm btn-toggle-collapse"
        onClick={() => {
          const newCollapsed = !collapsed;
          setCollapsed(newCollapsed);
          if (newCollapsed) setHovered(false); //  Reset hover on manual collapse
        }}
      >
        <i className={`fas fa-${collapsed ? 'angle-double-right' : 'angle-double-left'}`}></i>
      </button>


      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <a href="/dashboard" className="nav-link text-white">
            <i className="fas fa-tachometer-alt"></i>
            {actualExpanded && <span className="ms-2">Dashboard</span>}
          </a>
        </li>

        <li className="nav-item">
          <a href="/customers" className="nav-link text-white">
            <i className="fas fa-user"></i>
            {actualExpanded && <span className="ms-2">Customers</span>}
          </a>
        </li>
        {/* <li className="nav-item">
          <button
            className="nav-link btn btn-link text-white text-start w-100"
            onClick={() => toggleMenu('customers')}
          >
            <i className="fas fa-users"></i>
            {actualExpanded && <span className="ms-2">Customer</span>}
          </button>
          {actualExpanded && openMenu === 'customers' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item"><a href="/basic_info" className="nav-link text-white">Basic Information</a></li>
              <li className="nav-item"><a href="/loan_details" className="nav-link text-white">Loan Details</a></li>
            </ul>
          )}
        </li> */}

        <li className="nav-item">
          <a href="/Loan_Details" className="nav-link text-white">
            <i className="fas fa-user"></i>
            {actualExpanded && <span className="ms-2">Loans</span>}
          </a>
        </li>

        <li className="nav-item">
          <a href="/payments" className="nav-link text-white">
            <i className="bi bi-cash-stack"></i>
            {actualExpanded && <span className="ms-2">Payments</span>}
          </a>
        </li>

        <li className="nav-item">
          <a href="/reports" className="nav-link text-white">
            <i className="fas fa-cog"></i>
            {actualExpanded && <span className="ms-2">Reports</span>}
          </a>
        </li>

        {/* <li className="nav-item">
          <a href="/settings" className="nav-link text-white">
            <i className="fas fa-cog"></i>
            {actualExpanded && <span className="ms-2">Settings</span>}
          </a>
        </li> */}

        <li className="nav-item">
          <button
            className="nav-link btn btn-link text-white text-start w-100"
            onClick={() => toggleMenu('settings')}
          >
            <i className="fas fa-cog"></i>
            {actualExpanded && (
              <>
                <span className="ms-2">Settings</span>
                <i className={`fas fa-chevron-${openMenu === 'settings' ? 'down' : 'right'} ms-1`}></i>
              </>
            )}
          </button>

          {actualExpanded && openMenu === 'settings' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a href="/loan_config" className="nav-link text-white">Loan Config</a>
              </li>
              <li className="nav-item">
                <a href="/interest_rate" className="nav-link text-white">Interest Rate</a>
              </li>
              <li className="nav-item">
                <a href="/payment_methods" className="nav-link text-white">Payment Methods</a>
              </li>
              <li className="nav-item">
                <a href="/notifications" className="nav-link text-white">Notifications</a>
              </li>
              <li className="nav-item">
                <a href="/company_profile" className="nav-link text-white">Company Profiles</a>
              </li>
              <li className="nav-item">
                <a href="/users_roles" className="nav-link text-white">Users & Roles</a>
              </li>
              <li className="nav-item">
                <a href="/danger_zone" className="nav-link text-danger">Danger Zone</a>
              </li>
            </ul>
          )}
        </li>




      </ul>
    </aside>
  );
};

export default Sidebar;
