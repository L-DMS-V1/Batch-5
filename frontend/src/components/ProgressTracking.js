import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const ProgressTracking = () => {
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

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
      setError('Error fetching progress data');
      setLoading(false);
    }
  };

  const filteredProgresses = progresses.filter(progress => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        progress.employeeName.toLowerCase().includes(searchTerm) ||
        progress.courseName.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.status !== 'all') {
      return filters.status === 'completed' ? 
        progress.percentage === 100 : 
        progress.percentage < 100;
    }
    return true;
  });

  return (
    <div className="progress-tracking">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by employee or course..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading progress data...</div>
      ) : error ? (
        <div className="error">{error}</div>
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
              {filteredProgresses.map((progress) => (
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
    </div>
  );
};

export default ProgressTracking; 