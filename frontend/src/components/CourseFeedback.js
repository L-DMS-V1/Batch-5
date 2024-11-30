import React, { useState } from 'react';
import '../styles/CourseResources.css';

const CourseFeedback = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState({
    rating: '',
    comment: ''  // Changed from comments to comment to match backend DTO
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate rating is between 1-5
    const rating = parseInt(feedback.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    // Validate comment is not empty
    if (!feedback.comment.trim()) {
      alert('Please provide feedback comments');
      return;
    }

    const feedbackData = {
      rating: rating,
      comment: feedback.comment.trim()  // Using comment to match backend DTO
    };
    
    if (onSubmit) {
      onSubmit(feedbackData);
    }
  };

  return (
    <div className="feedback-form">
      <h3>Course Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating (1-5)</label>
          <select
            value={feedback.rating}
            onChange={(e) => setFeedback({...feedback, rating: e.target.value})}
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
            value={feedback.comment}  // Changed from comments to comment
            onChange={(e) => setFeedback({...feedback, comment: e.target.value})}  // Changed from comments to comment
            required
            placeholder="Please share your feedback about the course..."
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default CourseFeedback;