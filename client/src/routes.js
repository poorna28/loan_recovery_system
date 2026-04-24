
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import DashboardPage from './pages/Dashboard/Dashboard';
import PrivateRoute from './privateRoute';
// import Basic_Info from './pages/Customers/customer_list';
import Customers from './pages/Customers/customer_list';
import LoanDetails from './pages/Loans/loan_list';
import PaymentPage  from './pages/Payments/PaymentPage ';
import Reports from './pages/Reports/reports-list';
import CompanyProfile from './pages/Settings/Company-Profile/company-profile';
import LoanConfig from './pages/Settings/Loan-Config/loan-config';
import IntrestRate from './pages/Settings/Intrest-Rate/intrest-rate';
import PaymentMethods from './pages/Settings/Payment-Methods/payment-methods';
import Notifications from './pages/Settings/Notifications/notifications';
import UserRole from './pages/Settings/Users-Roles/user-role';
import DangerZone from './pages/Settings/Danger-Zone/danger-zone';


const routes = [
  { path: '/', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  // {path: '/basic_info', element: <Basic_Info />},
  {path: '/customers', element: <Customers />},
  {path: '/loan_details', element: <LoanDetails />},
  {path: '/payments',element: <PaymentPage   />},
  {path: '/reports', element: <Reports />},
  {path: '/company_profile', element: <CompanyProfile />},
  {path: '/loan_config', element: <LoanConfig />},
  {path: '/interest_rate', element: <IntrestRate />},
  {path: '/payment_methods', element: <PaymentMethods />},
  {path: '/notifications', element: <Notifications />},
  {path: '/users_roles', element: <UserRole />},
  {path: '/danger_zone', element: <DangerZone />},


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