// src/components/ManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import '../styles/Dashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    concepts: '',
    duration: '',
    employeePosition: '',
    requiredEmployees: 0
  });

  // Add handleLogout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Fetch requests when component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(ENDPOINTS.GET_MANAGER_REQUESTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        ENDPOINTS.MANAGER_REQUEST,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Add new request to the list with PENDING status
        const newRequest = {
          ...response.data,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        setRequests(prevRequests => [...prevRequests, newRequest]);

        setMessage({ text: 'Request submitted successfully!', type: 'success' });
        setTimeout(() => {
          setShowForm(false);
          setFormData({
            courseName: '',
            description: '',
            concepts: '',
            duration: '',
            employeePosition: '',
            requiredEmployees: 0
          });
          setMessage({ text: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Request Error:', error);
      setMessage({ text: 'Error submitting request. Please try again.', type: 'error' });
    }
  };

  // Calculate counts
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => !req.status || req.status === 'PENDING').length;
  const completedRequests = requests.filter(req => req.status === 'COMPLETED').length;

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
          <h1>Welcome back, <span className="user-name">Manager</span>! 👋</h1>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <i className="fas fa-list-alt stat-icon"></i>
            <h3>Total Requests</h3>
            <p className="stat-number">{totalRequests}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle stat-icon"></i>
            <h3>Completed</h3>
            <p className="stat-number">{completedRequests}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock stat-icon"></i>
            <h3>Pending</h3>
            <p className="stat-number">{pendingRequests}</p>
          </div>
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
                  name="courseName" 
                  placeholder="Course Name" 
                  value={formData.courseName} 
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="description" 
                  placeholder="Description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="concepts" 
                  placeholder="Concepts" 
                  value={formData.concepts} 
                  onChange={(e) => setFormData({...formData, concepts: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="duration" 
                  placeholder="Duration" 
                  value={formData.duration} 
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="employeePosition" 
                  placeholder="Employee Position" 
                  value={formData.employeePosition} 
                  onChange={(e) => setFormData({...formData, employeePosition: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  name="requiredEmployees" 
                  placeholder="Number of Required Employees" 
                  value={formData.requiredEmployees} 
                  onChange={(e) => setFormData({...formData, requiredEmployees: parseInt(e.target.value)})}
                  required
                  min="0"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Submit</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        )}

        <div className="requests-list-container">
          <h2>Your Requests</h2>
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={request.id || index}>
                    <td>{request.courseName}</td>
                    <td>{request.description}</td>
                    <td>
                      <span className={`status-badge ${(request.status || 'pending').toLowerCase()}`}>
                        {request.status || 'PENDING'}
                      </span>
                    </td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
