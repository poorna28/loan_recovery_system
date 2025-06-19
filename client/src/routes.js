// import LoginPage from './pages/Auth/LoginPage';
// import SignupPage from './pages/Auth/SignupPage';
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import DashboardPage from './pages/Dashboard/Dashboard';
// import DashboardPage from './pages/Dashboard/DashboardPage'; // for future use

const routes = [
  { path: '/', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  { path: '/dashboard', element: <DashboardPage />}
  // { path: '/dashboard', element: <DashboardPage /> },
];

export default routes;