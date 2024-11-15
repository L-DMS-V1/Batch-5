// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ENDPOINTS } from '../config/api';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, {
        userName: username,
        password
      });
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      
      if (userRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (userRole === 'MANAGER') {
        navigate('/manager-dashboard');
      } else if (userRole === 'EMPLOYEE') {
        navigate('/employee-dashboard');
      }
    } catch (error) {
      console.error('Login failed', error.response?.data);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;