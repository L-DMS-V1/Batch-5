// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import '../styles/Dashboard.css';
import FeedbackChart from './FeedbackChart'; // Import the FeedbackChart component
import ChangePasswordModal from './ChangePasswordModal';

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
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [courseForm, setCourseForm] = useState({
    courseId: '',
    courseName: '',
    keyConcepts: '',
    duration: '',
    resources: [{ resourceName: '', resourceLink: '' }],
    outcomes: ''
  });
  const [assignCourseForm, setAssignCourseForm] = useState({
    courseId: '',
    deadline: '',
    employeeIds: []
  });
  const [employees, setEmployees] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [showCreatedCourses, setShowCreatedCourses] = useState(false);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [courseProgresses, setCourseProgresses] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
      const [requestsRes, coursesRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_REQUESTS),
        axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_COURSES)
      ]);

      // Process courses
      const validCourses = coursesRes.data.filter(course => course !== null);
      console.log('Valid courses:', validCourses);
      setCourses(validCourses);

      // Group requests by ID and get latest status
      const latestRequests = requestsRes.data.reduce((acc, curr) => {
        if (!acc[curr.id] || new Date(curr.createdAt) > new Date(acc[curr.id].createdAt)) {
          acc[curr.id] = curr;
        }
        return acc;
      }, {});

      const finalRequests = Object.values(latestRequests);
      setRequests(finalRequests);

      // Filter accepted requests that don't have courses yet
      const acceptedReqs = finalRequests.filter(req => 
        req.status === 'APPROVED' && 
        !validCourses.some(course => course.courseName === req.courseName)
      );
      setAcceptedRequests(acceptedReqs);
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

  const handleAcceptRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        ENDPOINTS.ADMIN_ACCEPT_REQUEST(id),
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setMessage({ text: 'Request accepted successfully', type: 'success' });
      await Promise.all([
        fetchInitialData(),
        fetchAcceptedRequests()
      ]);

      // Find the accepted request and show course creation form
      const acceptedRequest = requests.find(req => req.id === id);
      if (acceptedRequest) {
        setCourseForm({
          courseName: acceptedRequest.courseName || '',
          keyConcepts: acceptedRequest.concepts || '',
          duration: acceptedRequest.duration || '',
          resources: [{ resourceName: '', resourceLink: '' }],
          outcomes: ''
        });
        setSelectedRequest(acceptedRequest);
        setShowCourseForm(true);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      setMessage({ text: 'Error accepting request', type: 'error' });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        ENDPOINTS.ADMIN_REJECT_REQUEST(requestId),
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage({ text: 'Request rejected successfully', type: 'success' });
      fetchInitialData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      setMessage({ text: error.response?.data?.message || 'Error rejecting request', type: 'error' });
    }
  };

  const handleAddResource = () => {
    setCourseForm({
      ...courseForm,
      resources: [...courseForm.resources, { resourceName: '', resourceLink: '' }]
    });
  };

  const handleRemoveResource = (index) => {
    const newResources = courseForm.resources.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, resources: newResources });
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...courseForm.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setCourseForm({ ...courseForm, resources: newResources });
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      // Get the course details
      const course = courses.find(c => c.courseId === courseId);
      if (!course) {
        setMessage({ text: 'Course not found', type: 'error' });
        return;
      }

      console.log('Course data for update:', course);

      // Pre-fill the course form with existing data
      const formData = {
        courseId: course.courseId,
        courseName: course.courseName || '',
        keyConcepts: course.keyConcepts || course.key_concepts || '',
        duration: course.duration || '',
        outcomes: course.outcomes || course.course_outcomes || '',
        resources: []
      };

      // Handle different possible resource structures
      if (course.resources && Array.isArray(course.resources)) {
        formData.resources = course.resources.map(r => ({
          resourceName: r.resourceName || r.resourceNames || '',
          resourceLink: r.resourceLink || r.resourceLinks || r.link || ''
        }));
      } else if (course.resourceLinksAndStatuses && Array.isArray(course.resourceLinksAndStatuses)) {
        formData.resources = course.resourceLinksAndStatuses.map(r => ({
          resourceName: r.resourceName || r.resourceNames || '',
          resourceLink: r.resourceLink || r.resourceLinks || r.link || ''
        }));
      }

      // Ensure at least one empty resource field
      if (!formData.resources || formData.resources.length === 0) {
        formData.resources = [{ resourceName: '', resourceLink: '' }];
      }

      console.log('Form data for update:', formData);

      // Set form data
      setCourseForm(formData);

      // Set update mode
      setSelectedCourseForUpdate(courseId);
      setShowCourseForm(true);
    } catch (error) {
      console.error('Error preparing course update:', error);
      setMessage({ text: 'Error preparing course update', type: 'error' });
    }
  };

  const handleSubmitCourseForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Log the current form state
      console.log('Current course form:', courseForm);

      const transformedCourseForm = {
        courseName: courseForm.courseName,
        keyConcepts: courseForm.keyConcepts,
        duration: courseForm.duration,
        outcomes: courseForm.outcomes,
        resources: courseForm.resources.map(resource => ({
          resourceName: resource.resourceName,
          resourceLink: resource.resourceLink
        }))
      };

      console.log('Submitting transformed course form:', transformedCourseForm);

      if (selectedCourseForUpdate) {
        await axiosInstance.put(
          ENDPOINTS.ADMIN_UPDATE_COURSE(selectedCourseForUpdate),
          transformedCourseForm,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMessage({ text: 'Course updated successfully', type: 'success' });
      } else {
        // Create new course
        const response = await axiosInstance.post(
          ENDPOINTS.ADMIN_CREATE_COURSE,
          transformedCourseForm,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data) {
          setMessage({ text: 'Course created successfully', type: 'success' });
          // Set the courseId for assignment
          setAssignCourseForm(prev => ({
            ...prev,
            courseId: response.data.courseId || response.data.id
          }));
          
          if (selectedRequest?.employeePosition) {
            await fetchEmployeesByPosition(selectedRequest.employeePosition);
            setShowAssignForm(true);
          }
        }
      }

      // Reset form and refresh data
      setSelectedCourseForUpdate(null);
      setShowCourseForm(false);
      await fetchInitialData();
    } catch (error) {
      console.error('Error submitting course:', error);
      const errorMessage = error.response?.data?.error || 'Error submitting course';
      setMessage({ text: errorMessage, type: 'error' });
    }
  };

  const fetchEmployeesByPosition = async (position) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_EMPLOYEES_BY_POSITION(position),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage({ text: 'Error fetching employees', type: 'error' });
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_ALL_REQUESTS,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      // Filter for accepted requests that don't have courses created yet
      const accepted = response.data.filter(req => req.status === 'APPROVED');
      setAcceptedRequests(accepted);
    } catch (error) {
      console.error('Error fetching accepted requests:', error);
      setMessage({ text: 'Error fetching accepted requests', type: 'error' });
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!assignCourseForm.courseId) {
        setMessage({ text: 'Course ID is missing', type: 'error' });
        return;
      }

      const formattedDeadline = new Date(assignCourseForm.deadline).toISOString().split('T')[0];
      
      const assignmentPayload = {
        courseId: assignCourseForm.courseId,
        employeeIds: assignCourseForm.employeeIds,
        deadline: formattedDeadline
      };

      console.log('Assignment payload:', assignmentPayload);

      await axiosInstance.post(
        ENDPOINTS.ADMIN_ASSIGN_COURSE,
        assignmentPayload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setMessage({ text: 'Course assigned successfully', type: 'success' });
      setShowAssignForm(false);
      setSelectedRequest(null);
      await fetchInitialData();
    } catch (error) {
      console.error('Error assigning course:', error);
      const errorMessage = error.response?.data?.message || 'Error assigning course';
      setMessage({ text: errorMessage, type: 'error' });
    }
  };

  const handleAssignExistingCourse = (course) => {
    // Fetch employees for the selected position first
    const fetchEmployeesForAssignment = async (position) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(
          ENDPOINTS.ADMIN_GET_EMPLOYEES_BY_POSITION(position),
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage({ text: 'Error fetching employees', type: 'error' });
      }
    };

    setSelectedRequest({
      employeePosition: '',
      requiredEmployees: 0
    });
    setAssignCourseForm({
      courseId: course.courseId,
      deadline: '',
      employeeIds: []
    });
    setShowCreatedCourses(false);
  };

  const handleAssignFromCreatedCourse = async (course) => {
    try {
      setSelectedRequest({
        employeePosition: course.employeePosition,
        requiredEmployees: course.requiredEmployees
      });
      
      setAssignCourseForm({
        courseId: course.courseId,
        deadline: '',
        employeeIds: []
      });

      // Fetch employees based on position
      if (course.employeePosition) {
        await fetchEmployeesByPosition(course.employeePosition);
      }

      setShowAssignForm(true);
    } catch (error) {
      console.error('Error preparing course assignment:', error);
      setMessage({ text: 'Error preparing course assignment', type: 'error' });
    }
  };

  const handleAssignFromCreatedCourses = async (course) => {
    try {
      // Fetch the original training request details for this course
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_ALL_REQUESTS,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Find the original request that matches this course
      const originalRequest = response.data.find(
        req => req.courseName === course.courseName && req.status === 'APPROVED'
      );

      if (originalRequest) {
        // Set the selected request with original details
        setSelectedRequest({
          ...originalRequest,
          employeePosition: originalRequest.employeePosition,
          requiredEmployees: originalRequest.requiredEmployees
        });

        // Set up the assignment form
        setAssignCourseForm({
          courseId: course.courseId,
          deadline: '',
          employeeIds: []
        });

        // Fetch employees for the position
        if (originalRequest.employeePosition) {
          await fetchEmployeesByPosition(originalRequest.employeePosition);
        }

        setShowAssignForm(true);
        setShowCreatedCourses(false); // Hide the created courses view
      } else {
        setMessage({ text: 'Could not find original request details', type: 'error' });
      }
    } catch (error) {
      console.error('Error preparing course assignment:', error);
      setMessage({ text: 'Error preparing course assignment', type: 'error' });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(
        ENDPOINTS.ADMIN_DELETE_COURSE(courseId),
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage({ text: 'Course deleted successfully', type: 'success' });
      fetchInitialData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage({ text: error.response?.data?.message || 'Error deleting course', type: 'error' });
    }
  };

  useEffect(() => {
    if (showCreatedCourses) {
      fetchCreatedCourses();
    }
  }, [showCreatedCourses]);

  const fetchCreatedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_ALL_COURSES,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setCreatedCourses(response.data);
    } catch (error) {
      console.error('Error fetching created courses:', error);
      setMessage({ text: 'Error fetching created courses', type: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchInitialData(),
          fetchAcceptedRequests()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ text: 'Error fetching data', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleCreateCourseClick = (request) => {
    setCourseForm({
      courseName: request.courseName || '',
      keyConcepts: request.concepts || '',
      duration: request.duration || '',
      resources: [{ resourceName: '', resourceLink: '' }],
      outcomes: request.outcomes || '',
      requestId: request.id // Store the request ID to update its status after course creation
    });
    setShowCourseForm(true);
  };

  const handleCourseCreationSuccess = async () => {
    try {
      await fetchAcceptedRequests(); // Refresh the accepted requests list
      await fetchCreatedCourses(); // Refresh the created courses list
      setShowCourseForm(false);
      setMessage({ text: 'Course created successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating lists:', error);
      setMessage({ text: 'Error updating lists', type: 'error' });
    }
  };

  const fetchCourseProgresses = async () => {
    try {
      setProgressLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_PROGRESSES);
      
      // Group progress data by courseId
      const groupedData = response.data.reduce((acc, progress) => {
        if (!acc[progress.courseId]) {
          acc[progress.courseId] = {
            courseId: progress.courseId,
            courseName: progress.courseName,
            employees: []
          };
        }
        acc[progress.courseId].employees.push({
          employeeId: progress.assignmentId,
          employeeName: progress.employeeName,
          completionPercentage: progress.percentage,
          deadline: progress.deadline,
          lastUpdatedDate: progress.lastUpdatedDate
        });
        return acc;
      }, {});

      // Convert to array
      const formattedData = Object.values(groupedData);
      console.log('Formatted data:', formattedData);
      setCourseProgresses(formattedData);
    } catch (error) {
      console.error('Error fetching course progresses:', error);
      setMessage({ text: 'Error fetching course progresses', type: 'error' });
      setCourseProgresses([]);
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    if (showProgressModal) {
      fetchCourseProgresses();
    }
  }, [showProgressModal]);

  const handleViewFeedback = async (courseId) => {
    try {
      console.log('Fetching feedback for courseId:', courseId);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [feedbacksRes, frequenciesRes] = await Promise.all([
        axiosInstance.get(`/api/admin/getFeedbacks/${courseId}`, config),
        axiosInstance.get(`/api/admin/getFeedbackFrequencies/${courseId}`, config)
      ]);

      console.log('API Responses:', {
        feedbacks: feedbacksRes.data,
        frequencies: frequenciesRes.data
      });

      setFeedbackData(frequenciesRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setMessage({ 
        text: error.response?.status === 404 
          ? 'No feedbacks found for this course' 
          : 'Error fetching feedback data', 
        type: 'error' 
      });
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_COURSES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage({ text: 'Error fetching courses', type: 'error' });
    }
  };

  useEffect(() => {
    if (showFeedbackModal) {
      fetchCourses();
    }
  }, [showFeedbackModal]);

  const handleCourseSelect = async (courseId) => {
    if (!courseId) return;
    
    try {
      setFeedbackLoading(true);
      console.log('Selected course ID:', courseId);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [feedbacksRes, frequenciesRes] = await Promise.all([
        axiosInstance.get(`/api/admin/getFeedbacks/${courseId}`, config),
        axiosInstance.get(`/api/admin/getFeedbackFrequencies/${courseId}`, config)
      ]);

      console.log('API Responses:', {
        feedbacks: feedbacksRes.data,
        frequencies: frequenciesRes.data
      });

      setFeedbackData(frequenciesRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setMessage({ text: 'Error fetching feedback data', type: 'error' });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const FeedbackModal = () => {
    if (!showFeedbackModal) return null;

    return (
      <div className="modal">
        <div className="modal-content feedback-modal">
          <h2>Course Feedbacks</h2>
          
          <div className="feedback-container">
            <div className="course-selector">
              <label>Select Course:</label>
              <select 
                value={selectedCourse || ''}
                onChange={(e) => {
                  const courseId = e.target.value ? parseInt(e.target.value, 10) : null;
                  if (courseId) {
                    setSelectedCourse(courseId);
                    handleCourseSelect(courseId);
                  }
                }}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {feedbackLoading ? (
              <div className="loading">Loading feedback data...</div>
            ) : selectedCourse && (
              <div className="feedback-content">
                {feedbackData && (
                  <div className="feedback-stats">
                    <h3>Rating Distribution</h3>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="rating-bar">
                        <span>{rating} ★</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${((feedbackData[rating] || 0) / 
                                Object.values(feedbackData).reduce((a, b) => a + b, 0)) * 100}%`,
                              backgroundColor: `hsl(${rating * 30}, 70%, 50%)`
                            }}
                          />
                        </div>
                        <span>{feedbackData[rating] || 0}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="feedback-list">
                  <h3>Feedback Comments ({feedbacks.length})</h3>
                  {feedbacks.length > 0 ? (
                    feedbacks.map(feedback => (
                      <div key={feedback.id} className="feedback-item">
                        <div className="feedback-header">
                          <span className="employee-name">{feedback.employeeName}</span>
                          <span className="rating">{feedback.rating} ★</span>
                        </div>
                        <p className="comments">{feedback.comments}</p>
                      </div>
                    ))
                  ) : (
                    <p>No feedback available for this course</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            className="admin-action-button"
            onClick={() => {
              setShowFeedbackModal(false);
              setSelectedCourse(null);
              setFeedbackData(null);
              setFeedbacks([]);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
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
          <button 
            className="create-button"
            onClick={() => setShowCreatedCourses(true)}
          >
            <i className="fas fa-book"></i> View Created Courses
          </button>
          <button 
            className="create-button"
            onClick={() => setShowProgressModal(true)}
          >
            <i className="fas fa-chart-line"></i> Course Progress
          </button>
          <button 
            className="create-button"
            onClick={() => setShowFeedbackModal(true)}
          >
            <i className="fas fa-comments"></i> View Feedbacks
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

        {showCreatedCourses && (
          <div className="modal">
            <div className="modal-content">
              <h2>Created Courses</h2>
              <div className="courses-list">
                {createdCourses.map((course) => (
                  <div key={course.courseId} className="course-card">
                    <h3>{course.courseName}</h3>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Key Concepts:</strong> {course.keyConcepts}</p>
                    <div className="course-actions">
                      <button
                        className="assign-button"
                        onClick={() => handleAssignFromCreatedCourses(course)}
                      >
                        <i className="fas fa-user-plus"></i> Assign Employees
                      </button>
                      <button
                        className="update-button"
                        onClick={() => handleUpdateCourse(course.courseId)}
                      >
                        <i className="fas fa-edit"></i> Update Course
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCourse(course.courseId)}
                      >
                        <i className="fas fa-trash-alt"></i> Delete Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="close-button"
                onClick={() => setShowCreatedCourses(false)}
              >
                Close
              </button>
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
                  <th>Position</th>
                  <th>Required Employees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  // Find if a course exists for this request
                  const courseExists = courses.some(course => course.courseName === request.courseName);
                  
                  return (
                    <tr key={request.id}>
                      <td>{request.courseName}</td>
                      <td>{request.description}</td>
                      <td>{request.employeePosition}</td>
                      <td>{request.requiredEmployees}</td>
                      <td>{request.status}</td>
                      <td>
                        {request.status === 'PENDING' && (
                          <>
                            <button className="admin-action-button accept-button" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                            <button className="admin-action-button reject-button" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                          </>
                        )}
                        {request.status === 'REJECTED' && (
                          <button 
                            className="admin-action-button re-evaluate-button"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Re-evaluate
                          </button>
                        )}
                        {request.status === 'APPROVED' && !courseExists && (
                          <button 
                            className="admin-action-button create-course-button"
                            onClick={() => handleCreateCourseClick(request)}
                          >
                            Create Course
                          </button>
                        )}
                        {request.status === 'APPROVED' && courseExists && (
                          <>
                            <button 
                              className="admin-action-button"
                              onClick={() => handleDeleteCourse(courses.find(c => c.courseName === request.courseName)?.id)}
                            >
                              Delete Course
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showCourseForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedCourseForUpdate ? 'Update Course' : 'Create Course'}</h2>
              <form onSubmit={handleSubmitCourseForm} className="form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Key Concepts"
                    value={courseForm.keyConcepts}
                    onChange={(e) => setCourseForm({...courseForm, keyConcepts: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Outcomes"
                    value={courseForm.outcomes}
                    onChange={(e) => setCourseForm({...courseForm, outcomes: e.target.value})}
                    required
                  />
                </div>
                
                <div className="resources-section">
                  <h3>Resources</h3>
                  {courseForm.resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                      <input
                        type="text"
                        placeholder="Resource Name"
                        value={resource.resourceName}
                        onChange={(e) => handleResourceChange(index, 'resourceName', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Resource Link"
                        value={resource.resourceLink}
                        onChange={(e) => handleResourceChange(index, 'resourceLink', e.target.value)}
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(index)}
                          className="remove-resource-button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="add-resource-button"
                  >
                    Add Resource
                  </button>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-button">Submit</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowCourseForm(false);
                      setSelectedCourseForUpdate(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedRequest && !showCourseForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Assign Course</h2>
              <form onSubmit={handleAssignCourse} className="form">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={assignCourseForm.deadline}
                    onChange={(e) => setAssignCourseForm({
                      ...assignCourseForm,
                      deadline: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {!selectedRequest.employeePosition && (
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={selectedRequest.employeePosition}
                      onChange={(e) => {
                        const position = e.target.value;
                        setSelectedRequest({
                          ...selectedRequest,
                          employeePosition: position
                        });
                        // Fetch employees when position changes
                        if (position) {
                          // fetchEmployeesForAssignment(position);
                        }
                      }}
                      required
                    />
                  </div>
                )}
                {!selectedRequest.requiredEmployees && (
                  <div className="form-group">
                    <label>Number of Employees Required</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedRequest.requiredEmployees}
                      onChange={(e) => setSelectedRequest({
                        ...selectedRequest,
                        requiredEmployees: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Select Employees {selectedRequest.requiredEmployees > 0 && `(Required: ${selectedRequest.requiredEmployees})`}</label>
                  <div className="employees-list">
                    {employees.map((employee) => (
                      <div key={employee.employeeId} className="employee-item">
                        <input
                          type="checkbox"
                          id={`employee-${employee.employeeId}`}
                          checked={assignCourseForm.employeeIds.includes(employee.employeeId)}
                          onChange={(e) => {
                            const newEmployeeIds = e.target.checked
                              ? [...assignCourseForm.employeeIds, employee.employeeId]
                              : assignCourseForm.employeeIds.filter(id => id !== employee.employeeId);
                            setAssignCourseForm({
                              ...assignCourseForm,
                              employeeIds: newEmployeeIds
                            });
                          }}
                        />
                        <label htmlFor={`employee-${employee.employeeId}`}>
                          {employee.userName} - {employee.position}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={
                      !assignCourseForm.deadline || 
                      !assignCourseForm.employeeIds.length ||
                      (selectedRequest.requiredEmployees > 0 && 
                       assignCourseForm.employeeIds.length !== selectedRequest.requiredEmployees)
                    }
                  >
                    Assign Course
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setSelectedRequest(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAssignForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Assign Course</h2>
              <form onSubmit={handleAssignCourse} className="form">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={assignCourseForm.deadline}
                    onChange={(e) => setAssignCourseForm({
                      ...assignCourseForm,
                      deadline: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {!selectedRequest.employeePosition && (
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={selectedRequest.employeePosition}
                      onChange={(e) => {
                        const position = e.target.value;
                        setSelectedRequest({
                          ...selectedRequest,
                          employeePosition: position
                        });
                        // Fetch employees when position changes
                        if (position) {
                          // fetchEmployeesForAssignment(position);
                        }
                      }}
                      required
                    />
                  </div>
                )}
                {!selectedRequest.requiredEmployees && (
                  <div className="form-group">
                    <label>Number of Employees Required</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedRequest.requiredEmployees}
                      onChange={(e) => setSelectedRequest({
                        ...selectedRequest,
                        requiredEmployees: parseInt(e.target.value) || 0
                      })}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Select Employees {selectedRequest.requiredEmployees > 0 && `(Required: ${selectedRequest.requiredEmployees})`}</label>
                  <div className="employees-list">
                    {employees.map((employee) => (
                      <div key={employee.employeeId} className="employee-item">
                        <input
                          type="checkbox"
                          id={`employee-${employee.employeeId}`}
                          checked={assignCourseForm.employeeIds.includes(employee.employeeId)}
                          onChange={(e) => {
                            const newEmployeeIds = e.target.checked
                              ? [...assignCourseForm.employeeIds, employee.employeeId]
                              : assignCourseForm.employeeIds.filter(id => id !== employee.employeeId);
                            setAssignCourseForm({
                              ...assignCourseForm,
                              employeeIds: newEmployeeIds
                            });
                          }}
                        />
                        <label htmlFor={`employee-${employee.employeeId}`}>
                          {employee.userName} - {employee.position}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={
                      !assignCourseForm.deadline || 
                      !assignCourseForm.employeeIds.length ||
                      (selectedRequest.requiredEmployees > 0 && 
                       assignCourseForm.employeeIds.length !== selectedRequest.requiredEmployees)
                    }
                  >
                    Assign Course
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowAssignForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showProgressModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Course Progress Overview</h2>
              {progressLoading ? (
                <div className="loading">Loading progress data...</div>
              ) : courseProgresses && courseProgresses.length > 0 ? (
                <div className="progress-container">
                  {courseProgresses.map((course) => (
                    <div key={course.courseId} className="course-progress-item">
                      <h3>{course.courseName}</h3>
                      <div className="employee-progress-list">
                        {course.employees && course.employees.map((employee) => (
                          <div key={employee.employeeId} className="employee-progress">
                            <div className="employee-header">
                              <span className="employee-name">{employee.employeeName}</span>
                              <span className={`status-badge ${employee.completionPercentage === 100 ? 'completed' : 
                                employee.completionPercentage >= 75 ? 'near-complete' :
                                employee.completionPercentage >= 50 ? 'in-progress' :
                                employee.completionPercentage >= 25 ? 'started' : 'not-started'}`}>
                                {employee.completionPercentage === 100 ? 'Completed' :
                                 employee.completionPercentage >= 75 ? 'Almost Done' :
                                 employee.completionPercentage >= 50 ? 'In Progress' :
                                 employee.completionPercentage >= 25 ? 'Started' : 'Just Started'}
                              </span>
                            </div>
                            <div className="progress-details">
                              <div className="progress-bar-container">
                                <div 
                                  className={`progress-bar ${
                                    employee.completionPercentage === 100 ? 'completed' :
                                    employee.completionPercentage >= 75 ? 'near-complete' :
                                    employee.completionPercentage >= 50 ? 'in-progress' :
                                    employee.completionPercentage >= 25 ? 'started' : 'not-started'
                                  }`}
                                  style={{ width: `${employee.completionPercentage}%` }}
                                >
                                  <span className="progress-text">
                                    {employee.completionPercentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="progress-dates">
                                <div className="date-item">
                                  <i className="fas fa-calendar-alt"></i>
                                  <span>Deadline: {new Date(employee.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="date-item">
                                  <i className="fas fa-clock"></i>
                                  <span>Updated: {new Date(employee.lastUpdatedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No course progress data available</div>
              )}
              <div className="modal-actions">
                <button onClick={() => {
                  setShowProgressModal(false);
                  setCourseProgresses(null); // Reset state when closing
                }} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showFeedbackModal && (
          <FeedbackModal />
        )}

        {showPasswordModal && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

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