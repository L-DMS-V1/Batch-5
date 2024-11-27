import React, { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const CourseFeedback = ({ courseId, assignmentId, onSubmit }) => {
  const [feedback, setFeedback] = useState({
    rating: '',
    comment: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        ENDPOINTS.EMPLOYEE_SUBMIT_FEEDBACK(courseId, assignmentId),
        feedback,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setMessage({ text: 'Feedback submitted successfully', type: 'success' });
      if (onSubmit) onSubmit();
    } catch (error) {
      setMessage({ text: 'Error submitting feedback', type: 'error' });
    }
  };

  return (
    <div className="feedback-container">
      <h3>Submit Course Feedback</h3>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Rating (1-5)</label>
          <select
            value={feedback.rating}
            onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
            required
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Comments</label>
          <textarea
            value={feedback.comment}
            onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
            required
            placeholder="Please share your feedback about the course..."
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CourseFeedback; 