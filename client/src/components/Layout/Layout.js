import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main className="main-content p-3">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
