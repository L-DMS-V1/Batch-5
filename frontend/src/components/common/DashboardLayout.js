import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const DashboardLayout = ({ children, userRole, stats }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">LearningHub</div>
        <div className="nav-links">
          <button className="nav-button" title="Profile">
            <i className="fas fa-user"></i>
          </button>
          <button className="nav-button" title="Notifications">
            <i className="fas fa-bell"></i>
          </button>
          <button className="nav-button" onClick={handleLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </nav>

      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome back, <span className="user-name">{userRole}</span>! 👋</h1>
        </div>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <i className={`fas ${stat.icon} stat-icon`}></i>
              <h3>{stat.title}</h3>
              <p className="stat-number">{stat.value}</p>
            </div>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout; 