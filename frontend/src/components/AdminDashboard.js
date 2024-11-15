// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(ENDPOINTS.ADMIN_GET_REQUESTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        ENDPOINTS.ADMIN_UPDATE_REQUEST,
        { requestId, status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchRequests(); // Refresh list after update
      setMessage({ text: 'Status updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ text: 'Failed to update status', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
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
          <h1>Welcome back, <span className="user-name">Admin</span>! 👋</h1>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <i className="fas fa-list-alt stat-icon"></i>
            <h3>Total Requests</h3>
            <p className="stat-number">{requests.length}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle stat-icon"></i>
            <h3>Completed</h3>
            <p className="stat-number">
              {requests.filter(req => req.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock stat-icon"></i>
            <h3>Pending</h3>
            <p className="stat-number">
              {requests.filter(req => req.status === 'PENDING').length}
            </p>
          </div>
        </div>

        <div className="requests-list-container">
          <h2>Training Requests</h2>
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.courseName}</td>
                    <td>{request.description}</td>
                    <td>
                      <span className={`status-badge ${request.status?.toLowerCase()}`}>
                        {request.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      {request.status !== 'COMPLETED' && (
                        <button
                          className="approve-button"
                          onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
