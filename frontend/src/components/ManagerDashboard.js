// src/components/ManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosInstance, ENDPOINTS, handleApiError } from '../config/api';
import '../styles/Dashboard.css';
import ChangePasswordModal from './ChangePasswordModal';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [positions, setPositions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    concepts: '',
    duration: '',
    employeePosition: '',
    requiredEmployees: 0
  });
  const [isReRequest, setIsReRequest] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'MANAGER') {
      navigate('/login');
      return;
    }
    
    fetchRequests();
    fetchPositions();
  }, [navigate]);

  const fetchPositions = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.MANAGER_GET_POSITIONS);
      if (response.data && response.data.positions) {
        setPositions(response.data.positions);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      setMessage({ text: 'Error fetching positions', type: 'error' });
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.MANAGER_GET_REQUESTS);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage({ text: 'Error fetching requests', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const managerId = localStorage.getItem('userId');
      const requestPayload = {
        managerId: parseInt(managerId),
        courseName: formData.courseName,
        description: formData.description,
        concepts: formData.concepts,
        duration: formData.duration,
        employeePosition: formData.employeePosition,
        requiredEmployees: parseInt(formData.requiredEmployees),
        status: 'PENDING',
        isReRequest: isReRequest
      };

      console.log('Submitting request:', requestPayload);

      const response = await axiosInstance.post(
        ENDPOINTS.MANAGER_CREATE_REQUEST,
        requestPayload
      );

      console.log('Request successful:', response.data);
      setMessage({ text: 'Request submitted successfully!', type: 'success' });
      setShowForm(false);
      setFormData({
        courseName: '',
        description: '',
        concepts: '',
        duration: '',
        employeePosition: '',
        requiredEmployees: 0
      });
      setIsReRequest(false);
      fetchRequests();
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error submitting request', 
        type: 'error' 
      });
    }
  };

  const handleReRequest = async (request) => {
    try {
      // Send request with same ID but updated status
      const response = await axiosInstance.post(
        ENDPOINTS.MANAGER_CREATE_REQUEST,
        {
          ...request,
          id: request.id,
          status: 'PENDING',
          createdAt: new Date().toISOString() // Add current timestamp
        }
      );
      
      setMessage({ text: 'Course re-requested successfully', type: 'success' });
      fetchRequests();
    } catch (error) {
      console.error('Error re-requesting course:', error);
      setMessage({ text: handleApiError(error, setMessage), type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Calculate stats for dashboard
  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: 'fa-list-alt'
    },
    {
      title: 'Pending',
      value: requests.filter(r => r.status === 'PENDING').length,
      icon: 'fa-clock'
    },
    {
      title: 'Completed',
      value: requests.filter(r => r.status === 'COMPLETED').length,
      icon: 'fa-check-circle'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div className="button-group">
          <button className="action-button" onClick={() => setShowPasswordModal(true)}>
            <i className="fas fa-key"></i> Change Password
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome back, <span className="user-name">Manager</span>! 👋</h1>
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

        <div className="create-request-section">
          <button className="create-button" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Create New Request
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>Create Training Request</h2>
            <form onSubmit={handleSubmit} className="training-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Key Concepts"
                  value={formData.concepts}
                  onChange={(e) => setFormData({...formData, concepts: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  value={formData.employeePosition}
                  onChange={(e) => setFormData({...formData, employeePosition: e.target.value})}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Required Employees"
                  value={formData.requiredEmployees}
                  onChange={(e) => setFormData({...formData, requiredEmployees: parseInt(e.target.value)})}
                  required
                  min="1"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Submit Request</button>
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="requests-list-container">
          <h2>My Training Requests</h2>
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Position</th>
                  <th>Required Employees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.courseName}</td>
                    <td>{request.description}</td>
                    <td>{request.employeePosition}</td>
                    <td>{request.requiredEmployees}</td>
                    <td>
                      <span className={`status-badge ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
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
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;