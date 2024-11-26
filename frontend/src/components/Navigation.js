import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Don't show navigation on dashboard pages
  const isDashboardPage = location.pathname.includes('dashboard');
  if (!token || isDashboardPage) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

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