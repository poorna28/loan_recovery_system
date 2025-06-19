import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const Header = () => (
  <header className="header-fixed d-flex justify-content-between align-items-center px-4">
    <div className="d-flex align-items-center gap-2">
      <i className="fas fa-search text-muted"></i>
      <input type="text" className="form-control form-control-sm" placeholder="Search..." />
    </div>
    <div className="d-flex align-items-center gap-3">
      <i className="fas fa-bell text-secondary"></i>
      <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </header>
);

export default Header;
