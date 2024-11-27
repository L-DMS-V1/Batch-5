import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import '../styles/CourseProgress.css';

const CourseProgress = () => {
  const [progresses, setProgresses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgresses();
  }, []);

  const fetchProgresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        ENDPOINTS.ADMIN_GET_PROGRESSES,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      setProgresses(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Error fetching progress data', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="progress-container">
      <h2>Course Progress</h2>
      {loading ? (
        <div className="loading">Loading progress data...</div>
      ) : (
        <div className="progress-table">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {progresses.map((progress) => (
                <tr key={progress.assignmentId}>
                  <td>{progress.employeeName}</td>
                  <td>{progress.courseName}</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress.percentage}%` }}
                      />
                      <span>{progress.percentage}%</span>
                    </div>
                  </td>
                  <td>{progress.deadline}</td>
                  <td>{progress.lastUpdatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CourseProgress; 