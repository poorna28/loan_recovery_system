import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content p-0">
          {children}  {/* Page content goes here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;