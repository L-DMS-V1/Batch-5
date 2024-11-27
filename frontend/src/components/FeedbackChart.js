import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import { Chart } from 'react-chartjs-2';

const FeedbackChart = ({ courseId }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbackData();
  }, [courseId]);

  const fetchFeedbackData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [frequencyResponse, feedbacksResponse] = await Promise.all([
        axios.get(ENDPOINTS.ADMIN_GET_FEEDBACK_FREQUENCIES(courseId), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(ENDPOINTS.ADMIN_GET_FEEDBACKS(courseId), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setFeedbackData(frequencyResponse.data);
      setFeedbacks(feedbacksResponse.data);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  return (
    <div className="feedback-chart-container">
      {feedbackData && (
        <>
          <div className="chart-section">
            <h3>Rating Distribution</h3>
            <Chart 
              type="bar"
              data={{
                labels: Object.keys(feedbackData),
                datasets: [{
                  label: 'Number of Ratings',
                  data: Object.values(feedbackData)
                }]
              }}
            />
          </div>
          <div className="feedback-list">
            <h3>Feedback Comments</h3>
            {feedbacks.map(feedback => (
              <div key={feedback.feedBackId} className="feedback-item">
                <p><strong>Rating:</strong> {feedback.rating}/5</p>
                <p><strong>Comment:</strong> {feedback.comments}</p>
                <p><strong>By:</strong> {feedback.employeeName}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackChart; 