// src/components/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import CourseFeedback from './CourseFeedback';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const employeeId = localStorage.getItem('employeeId');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedCourseForFeedback, setSelectedCourseForFeedback] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        ENDPOINTS.EMPLOYEE_GET_COURSES(employeeId),
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setCourses(response.data);
    } catch (error) {
      setMessage({ text: 'Error fetching courses', type: 'error' });
    }
  };

  const handleCourseClick = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        ENDPOINTS.EMPLOYEE_GET_COURSE(employeeId, courseId),
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setSelectedCourse(response.data);
    } catch (error) {
      setMessage({ text: 'Error fetching course details', type: 'error' });
    }
  };

  const handleResourceCompletion = async (resourceId, completed) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = completed ? 
        ENDPOINTS.EMPLOYEE_MARK_COMPLETED(employeeId, resourceId) :
        ENDPOINTS.EMPLOYEE_MARK_NOT_COMPLETED(employeeId, resourceId);
      
      const response = await axios.put(
        endpoint,
        {},
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      // If course is completed, show feedback form
      if (response.data.message === "Course completed") {
        setSelectedCourseForFeedback(selectedCourse);
        setShowFeedbackForm(true);
      }

      setMessage({ text: response.data.message, type: 'success' });
      
      // Refresh course details
      if (selectedCourse) {
        handleCourseClick(selectedCourse.courseId);
      }
    } catch (error) {
      setMessage({ text: 'Error updating resource status', type: 'error' });
    }
  };

  const handleSubmitFeedback = async (courseId, assignmentId, feedback) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        ENDPOINTS.EMPLOYEE_SUBMIT_FEEDBACK(courseId, assignmentId),
        feedback,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setMessage({ text: 'Feedback submitted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error submitting feedback', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">LearningHub</div>
        <div className="nav-links">
          <button className="nav-button" onClick={() => navigate('/profile')}>
            <i className="fas fa-user"></i>
          </button>
          <button className="nav-button" onClick={() => {
            localStorage.clear();
            navigate('/');
          }}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </nav>

      <div className="dashboard-main">
        <div className="courses-section">
          <h2>My Courses</h2>
          <div className="courses-grid">
            {courses.map(course => (
              <div 
                key={course.courseId} 
                className="course-card"
                onClick={() => handleCourseClick(course.courseId)}
              >
                <h3>{course.courseName}</h3>
                <p>Duration: {course.duration}</p>
                <p>Deadline: {course.deadLine}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="course-details">
            <h2>{selectedCourse.courseName}</h2>
            <div className="course-info">
              <p><strong>Key Concepts:</strong> {selectedCourse.keyConcepts}</p>
              <p><strong>Duration:</strong> {selectedCourse.duration}</p>
              <p><strong>Outcomes:</strong> {selectedCourse.outcomes}</p>
            </div>

            <div className="resources-list">
              <h3>Resources</h3>
              {selectedCourse.resourceLinksAndStatuses.map(resource => (
                <div key={resource.resourceId} className="resource-item">
                  <a href={resource.resourceLink} target="_blank" rel="noopener noreferrer">
                    {resource.resourceLink}
                  </a>
                  <button
                    onClick={() => handleResourceCompletion(
                      resource.resourceId, 
                      !resource.completed
                    )}
                    className={`status-button ${resource.completed ? 'completed' : ''}`}
                  >
                    {resource.completed ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showFeedbackForm && selectedCourseForFeedback && (
          <CourseFeedback 
            courseId={selectedCourseForFeedback.courseId}
            assignmentId={selectedCourseForFeedback.assignmentId}
            onSubmit={() => {
              setShowFeedbackForm(false);
              setSelectedCourseForFeedback(null);
              fetchCourses(); // Refresh courses list
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
