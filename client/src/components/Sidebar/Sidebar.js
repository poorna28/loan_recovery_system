import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'; // Adjust if needed

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className={`sidebar-fixed ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="btn btn-sm btn-toggle-collapse"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`fas fa-${collapsed ? 'angle-double-right' : 'angle-double-left'}`}></i>
      </button>

      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <i className="fas fa-tachometer-alt"></i>
            {!collapsed && <span className="ms-2">Dashboard</span>}
          </a>
        </li>

        <li className="nav-item">
          <button className="nav-link btn btn-link text-white text-start w-100" onClick={() => toggleMenu('customers')}>
            <i className="fas fa-users"></i>
            {!collapsed && <span className="ms-2">Customers</span>}
          </button>
          {!collapsed && openMenu === 'customers' && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item"><a href="#" className="nav-link text-white">Loan Customers</a></li>
              <li className="nav-item"><a href="#" className="nav-link text-white">Recovery</a></li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <i className="fas fa-user"></i>
            {!collapsed && <span className="ms-2">Users</span>}
          </a>
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link text-white">
            <i className="fas fa-cog"></i>
            {!collapsed && <span className="ms-2">Settings</span>}
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
