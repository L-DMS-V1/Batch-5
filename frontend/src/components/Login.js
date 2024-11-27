// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import { jwtDecode } from 'jwt-decode';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, credentials);
      
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        
        // Store complete user info
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userName', user.username);
        localStorage.setItem('userId', user.id); // Store the manager/admin/employee ID
        
        // Set default auth header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Navigate based on role
        const role = user.role.toLowerCase();
        navigate(`/${role}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Invalid credentials', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.userName}
              onChange={(e) => setCredentials({
                ...credentials,
                userName: e.target.value.trim()
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              required
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
          >
            Login
          </button>
          <p className="auth-link">
            Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
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

export default Login;