
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import DashboardPage from './pages/Dashboard/Dashboard';
import PrivateRoute from './privateRoute';
import Basic_Info from './pages/Customers/baisc_information';
import Loan_Details from './pages/Customers/loan_details';

const routes = [
  { path: '/', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  {path: '/basic_info', element: <Basic_Info />},
  {path: '/loan_details', element: <Loan_Details />},
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