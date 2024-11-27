// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    accountName: '',
    userName: '',
    password: '',
    email: '',
    role: 'EMPLOYEE',
    position: '',
    contact: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
      try {
          const token = localStorage.getItem('token');
          const [requestsRes, coursesRes] = await Promise.all([
              axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_REQUESTS, {
                  headers: { 'Authorization': `Bearer ${token}` }
              }),
              axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_COURSES, {
                  headers: { 'Authorization': `Bearer ${token}` }
              })
          ]);
          console.log('Requests:', requestsRes.data); // Log the requests data
          setRequests(requestsRes.data);
          setCourses(coursesRes.data);
      } catch (error) {
          console.error('Error fetching data:', error);
          setMessage({ text: 'Error fetching data', type: 'error' });
      } finally {
          setLoading(false);
      }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(
        ENDPOINTS.ADMIN_ADD_EMPLOYEE,
        employeeForm,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setMessage({ text: 'Employee added successfully', type: 'success' });
      setShowAddEmployeeForm(false);
      setEmployeeForm({
        accountName: '',
        userName: '',
        password: '',
        email: '',
        role: 'EMPLOYEE',
        position: '',
        contact: ''
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      setMessage({ text: error.response?.data?.message || 'Error adding employee', type: 'error' });
    }
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
          <button 
            className="nav-button" 
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }} 
            title="Logout"
          >
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
            <i className="fas fa-users stat-icon"></i>
            <h3>Total Requests</h3>
            <p className="stat-number">{requests.length}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-book stat-icon"></i>
            <h3>Total Courses</h3>
            <p className="stat-number">{courses.length}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock stat-icon"></i>
            <h3>Pending Requests</h3>
            <p className="stat-number">
              {requests.filter(r => r.status === 'PENDING').length}
            </p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="create-button"
            onClick={() => setShowAddEmployeeForm(true)}
          >
            <i className="fas fa-user-plus"></i> Add Employee
          </button>
        </div>

        {showAddEmployeeForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Employee</h2>
              <form onSubmit={handleAddEmployee} className="form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={employeeForm.accountName}
                    onChange={(e) => setEmployeeForm({...employeeForm, accountName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={employeeForm.userName}
                    onChange={(e) => setEmployeeForm({...employeeForm, userName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Position"
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Contact"
                    value={employeeForm.contact}
                    onChange={(e) => setEmployeeForm({...employeeForm, contact: e.target.value})}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="submit-button">Add Employee</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowAddEmployeeForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                      <span className={`status-badge ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === 'PENDING' && (
                        <div className="action-buttons">
                          <button className="accept-button">Accept</button>
                          <button className="reject-button">Reject</button>
                        </div>
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