import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import "../styles/CourseProgress.css";

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
    <div style={{
      width: '100%',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px'
      }}>Course Progress</h2>
      {loading ? (
        <div style={{
          width: '100%',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
          color: '#666'
        }}>Loading progress data...</div>
      ) : (
        <div style={{
          width: '100%',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{
                  padding: '10px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>Employee</th>
                <th style={{
                  padding: '10px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>Course</th>
                <th style={{
                  padding: '10px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>Progress</th>
                <th style={{
                  padding: '10px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>Deadline</th>
                <th style={{
                  padding: '10px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {progresses.map((progress) => (
                <tr key={progress.assignmentId}>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    color: '#666'
                  }}>{progress.employeeName}</td>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    color: '#666'
                  }}>{progress.courseName}</td>
                  <td>
                    <div className="course-progress-bar">
                      <div 
                        className="course-progress-fill"
                        style={{ 
                          width: `${progress.percentage}%`,
                          backgroundColor: progress.percentage === 100 ? '#007bff'  :
                                         progress.percentage >= 75 ? '#28a745 ' :
                                         progress.percentage >= 40 ? '#ffc107 ' :
                                         '#dc3545 '
                        }}
                      />
                      <span>{progress.percentage}%</span>
                    </div>
                  </td>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    color: '#666'
                  }}>{progress.deadline}</td>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    color: '#666'
                  }}>{progress.lastUpdatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message.text && (
        <div style={{
          width: '100%',
          padding: '10px',
          backgroundColor: message.type === 'error' ? '#f44336' : '#4CAF50',
          color: '#fff',
          borderRadius: '10px',
          marginTop: '20px'
        }}>{message.text}</div>
      )}
    </div>
  );
};

export default CourseProgress;