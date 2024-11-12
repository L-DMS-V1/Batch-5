// src/components/EmployeeDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
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

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Welcome Message - simplified */}
        <div className="welcome-section">
          <h1>Welcome back, <span className="user-name">Employee</span>! 👋</h1>
        </div>

        {/* Course Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <i className="fas fa-book-reader stat-icon"></i>
            <h3>Total Courses Assigned</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-spinner stat-icon"></i>
            <h3>Courses Ongoing</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle stat-icon"></i>
            <h3>Courses Completed</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        {/* Learning Sections */}
        <div className="learning-sections">
          <div className="section-card">
            <h3><i className="fas fa-graduation-cap"></i> My Learnings</h3>
            <div className="section-content">
              <p>No courses available yet</p>
              <button className="view-button">View All</button>
            </div>
          </div>
          
          <div className="section-card">
            <h3><i className="fas fa-chart-line"></i> My Progress</h3>
            <div className="section-content">
              <p>No progress data available</p>
              <button className="view-button">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
