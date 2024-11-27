import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const FeedbackOverview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchFeedbacks(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        ENDPOINTS.ADMIN_GET_ALL_COURSES,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        ENDPOINTS.ADMIN_GET_FEEDBACKS(courseId),
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  return (
    <div className="feedback-overview">
      <div className="course-selector">
        <select
          value={selectedCourse || ''}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : selectedCourse ? (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.feedBackId} className="feedback-card">
              <div className="rating">
                Rating: {feedback.rating}/5
              </div>
              <div className="comment">
                "{feedback.comments}"
              </div>
              <div className="employee">
                - {feedback.employeeName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="select-prompt">
          Please select a course to view feedback
        </div>
      )}
    </div>
  );
};

export default FeedbackOverview; 