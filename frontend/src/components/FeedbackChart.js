import React, { useState, useEffect } from 'react';
import { axiosInstance, ENDPOINTS } from '../config/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeedbackChart = ({ courseId }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (courseId) {
      console.log('FeedbackChart: Fetching data for courseId:', courseId);
      fetchFeedbackData();
    }
  }, [courseId]);

  const fetchFeedbackData = async () => {
    try {
      console.log('Making API calls for courseId:', courseId);
      
      const frequencyUrl = `${ENDPOINTS.ADMIN_GET_FEEDBACK_FREQUENCIES}/${courseId}`;
      const feedbacksUrl = `${ENDPOINTS.ADMIN_GET_FEEDBACKS}/${courseId}`;
      
      console.log('Frequency URL:', frequencyUrl);
      console.log('Feedbacks URL:', feedbacksUrl);

      const [frequencyResponse, feedbacksResponse] = await Promise.all([
        axiosInstance.get(frequencyUrl),
        axiosInstance.get(feedbacksUrl)
      ]);

      console.log('Frequency Response:', frequencyResponse);
      console.log('Feedbacks Response:', feedbacksResponse);

      setFeedbackData(frequencyResponse.data);
      setFeedbacks(feedbacksResponse.data);
    } catch (error) {
      console.error('Error fetching feedback data:', {
        error: error,
        message: error.message,
        response: error.response,
        courseId: courseId
      });
    }
  };

  const chartData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        label: 'Number of Ratings',
        data: feedbackData ? [
          feedbackData['1'] || 0,
          feedbackData['2'] || 0,
          feedbackData['3'] || 0,
          feedbackData['4'] || 0,
          feedbackData['5'] || 0
        ] : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Rating Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="feedback-chart-container">
      <div className="chart-section">
        {feedbackData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
      
      <div className="feedback-list">
        <h3>Feedback Comments ({feedbacks.length})</h3>
        {feedbacks.length > 0 ? (
          feedbacks.map(feedback => (
            <div key={feedback.feedBackId} className="feedback-item">
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
  );
};

export default FeedbackChart;