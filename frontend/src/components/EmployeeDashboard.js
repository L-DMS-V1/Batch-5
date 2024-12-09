import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import CourseFeedback from './CourseFeedback';
import CourseResources from './CourseResources';
import ChangePasswordModal from './ChangePasswordModal';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  const fetchAssignedCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSES);
      
      // Fetch detailed course data for each course
      const coursesWithDetails = await Promise.all(
        response.data.map(async (course) => {
          try {
            const courseDetailResponse = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSE(course.courseId));
            return courseDetailResponse.data;
          } catch (error) {
            console.error(`Error fetching details for course ${course.courseId}:`, error);
            return course; // fallback to original course data
          }
        })
      );

      setAssignedCourses(coursesWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned courses:', error);
      setError('Failed to fetch assigned courses');
      setLoading(false);
    }
  };

  const handleGoToCourse = (courseId) => {
    setSelectedCourse(courseId);
    setShowResources(true);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setShowResources(false);
    fetchAssignedCourses(); // Refresh courses to update completion status
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
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
        {showResources && selectedCourse ? (
          <CourseResources 
            courseId={selectedCourse}
            onBack={handleBackToCourses}
            onResourceComplete={fetchAssignedCourses}
          />
        ) : (
          <>
            <div className="welcome-section">
              <h1>Welcome back, <span className="user-name">Employee</span>! 👋</h1>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <i className="fas fa-book stat-icon"></i>
                <h3>Total Courses</h3>
                <p className="stat-number">{assignedCourses.length}</p>
              </div>

              <div className="stat-card">
                <i className="fas fa-check-circle stat-icon"></i>
                <h3>Completed Courses</h3>
                <p className="stat-number">
                  {(() => {
                    console.log('Full Assigned Courses Data:', JSON.stringify(assignedCourses, null, 2));
                    const completedCourses = assignedCourses.filter(course => {
                      console.log(`Course ${course.courseName} Resource Links:`, 
                        course.resourceLinksAndStatuses?.map(r => ({
                          link: r.resourceLink, 
                          completed: r.completed
                        }))
                      );
                      return course.resourceLinksAndStatuses?.every(r => r.completed);
                    });
                    console.log('Completed Courses:', completedCourses);
                    return completedCourses.length;
                  })()}
                </p>
              </div>

              <div className="stat-card">
                <i className="fas fa-clock stat-icon"></i>
                <h3>In Progress</h3>
                <p className="stat-number">
                  {assignedCourses.filter(course => 
                    course.resourceLinksAndStatuses?.some(r => r.completed) &&
                    !course.resourceLinksAndStatuses?.every(r => r.completed)
                  ).length}
                </p>
              </div>

              
            </div>

            <div className="courses-section">
              <h2>My Courses</h2>
              {loading && <p>Loading courses...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loading && !error && assignedCourses.length === 0 && (
                <p>No courses assigned yet.</p>
              )}
              <div className="courses-grid">
                {assignedCourses.map(course => (
                  <div key={course.courseId} className="course-card">
                    <div className="course-card-header">
                      <h3>{course.courseName}</h3>
                      <span className="course-status">
                        {course.resourceLinksAndStatuses?.every(r => r.completed) 
                          ? <i className="fas fa-check-circle completed"></i>
                          : <i className="fas fa-clock in-progress"></i>
                        }
                      </span>
                    </div>
                    <div className="course-card-body">
                      <p><i className="fas fa-clock"></i> Duration: {course.duration}</p>
                      <p><i className="fas fa-calendar"></i> Deadline: {course.deadLine}</p>
                      <p><i className="fas fa-lightbulb"></i> Key Concepts: {course.keyConcepts}</p>
                    </div>
                    <button 
                      className="go-to-course-button"
                      onClick={() => handleGoToCourse(course.courseId)}
                    >
                      Go to Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
