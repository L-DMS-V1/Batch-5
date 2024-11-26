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
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [courseData, setCourseData] = useState({
    courseName: '',           // From request
    courseDescription: '',    // From request
    courseDuration: '',       // From request
    courseContent: '',        // Tutorial links
    courseDocuments: '',      // Document links
    courseAssignments: '',    // Assignments
    employeeEmail: ''         // Email to assign course
  });
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });

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

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setCourseData({
      ...courseData,
      courseName: request.courseName,
      courseDescription: request.description,
      courseDuration: request.duration
    });
    setShowCourseForm(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
  
      
      const endpoint = ENDPOINTS.ADMIN_CREATE_COURSE(selectedRequest.id);
  
      const response = await axios.post(
        endpoint,
        {
          ...courseData,
          requestId: selectedRequest.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setFormMessage({ text: 'Course created successfully!', type: 'success' });
        setTimeout(() => {
          setShowCourseForm(false);
          fetchRequests();
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setFormMessage({ text: 'Failed to create course. Please try again.', type: 'error' });
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
                      <span className={`status-badge ${request.status?.toLowerCase() || 'pending'}`}>
                        {request.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="approve-button"
                        onClick={() => handleApprove(request)}
                      >
                        Create Course
                      </button>
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

        {/* Course Creation Form */}
        {showCourseForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create Course Content</h2>
              <form onSubmit={handleCourseSubmit} className="course-form">
                <div className="form-group">
                  <label>Course Name</label>
                  <input 
                    type="text"
                    value={courseData.courseName}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={courseData.courseDescription}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <input 
                    type="text"
                    value={courseData.courseDuration}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Tutorial Links</label>
                  <textarea 
                    placeholder="Add video/tutorial links (one per line)"
                    value={courseData.courseContent}
                    onChange={(e) => setCourseData({
                      ...courseData,
                      courseContent: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Document Links</label>
                  <textarea 
                    placeholder="Add document links (one per line)"
                    value={courseData.courseDocuments}
                    onChange={(e) => setCourseData({
                      ...courseData,
                      courseDocuments: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Practice Assignments</label>
                  <textarea 
                    placeholder="Add practice assignments"
                    value={courseData.courseAssignments}
                    onChange={(e) => setCourseData({
                      ...courseData,
                      courseAssignments: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Assign to Employee (Email)</label>
                  <input 
                    type="email"
                    value={courseData.employeeEmail}
                    onChange={(e) => setCourseData({...courseData, employeeEmail: e.target.value})}
                    required
                  />
                </div>

                {formMessage.text && (
                  <div className={`form-message ${formMessage.type}`}>
                    {formMessage.text}
                  </div>
                )}

                <div className="form-buttons">
                  <button type="submit" className="submit-button">Create Course</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowCourseForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;