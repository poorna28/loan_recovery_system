import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/modal.css';
import routes from './routes';

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
