import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (!token) {
    return null; // Don't show navigation if not logged in
  }

  return (
    <nav>
      <ul>
        {role === 'ADMIN' && (
          <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        )}
        {role === 'MANAGER' && (
          <li><Link to="/manager-dashboard">Manager Dashboard</Link></li>
        )}
        {role === 'EMPLOYEE' && (
          <li><Link to="/employee-dashboard">Employee Dashboard</Link></li>
        )}
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navigation;
