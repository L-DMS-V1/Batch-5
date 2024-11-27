import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardNavBar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/', { replace: true });
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">LearningHub</div>
      <div className="nav-links">
        <button className="nav-button" title="Profile">
          <i className="fas fa-user"></i>
        </button>
        <button className="nav-button" title="Notifications">
          <i className="fas fa-bell"></i>
        </button>
        <button 
          className="nav-button" 
          onClick={handleLogout} 
          title="Logout"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavBar; 