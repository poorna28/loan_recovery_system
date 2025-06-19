import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ padding: '20px', flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
