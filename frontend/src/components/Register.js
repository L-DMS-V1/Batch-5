import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountName: '',
    userName: '',
    password: '',
    email: '',
    role: 'MANAGER'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending registration data:', formData);

      const response = await axios.post(ENDPOINTS.REGISTER, formData);
      console.log('Registration response:', response.data);

      setMessage({ 
        text: 'Registration successful! Redirecting to login...', 
        type: 'success' 
      });

      // Store registration data for login
      localStorage.setItem('registeredUserName', formData.userName);
      
      setTimeout(() => {
        navigate('/login', { 
          state: { userName: formData.userName }
        });
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setMessage({ 
        text: error.response?.data?.message || 'Registration failed', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({...formData, accountName: e.target.value.trim()})}
              required
              placeholder="Enter account name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value.trim()})}
              required
              placeholder="Enter username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value.trim()})}
              required
              placeholder="Enter email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
              disabled={loading}
            >
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="auth-link">
            Already have an account? <span onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
