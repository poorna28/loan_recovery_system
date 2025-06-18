import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import '../../styles/DashboardPage.css';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) navigate('/');
    else setUser(user);
  }, [navigate]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-body">
          <h2>Welcome, {user?.username}!</h2>
          <p>This is your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
