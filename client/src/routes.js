
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import DashboardPage from './pages/Dashboard/Dashboard';
import PrivateRoute from './privateRoute';

const routes = [
  { path: '/', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
{
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    )
  }
  
];

export default routes;