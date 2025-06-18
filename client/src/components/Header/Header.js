import React from 'react';
import '../../styles/Header.css';
const Header = () => {
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="header">
      <h1>Loan Management System</h1>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default Header;
