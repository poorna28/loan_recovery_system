
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import DashboardPage from './pages/Dashboard/Dashboard';
import PrivateRoute from './privateRoute';
import Basic_Info from './pages/Customers/customer_list';
import Loan_Details from './pages/Loans/loan_list';
import Payment_Page from './pages/Payments/payment_page';


const routes = [
  { path: '/', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  {path: '/basic_info', element: <Basic_Info />},
  {path: '/loan_details', element: <Loan_Details />},
  {path: '/payments',element: <Payment_Page  />},

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