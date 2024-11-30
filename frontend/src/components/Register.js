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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: ''
  });

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Special character');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Number');
    }

    // Uppercase letter check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uppercase letter');
    }

    // Lowercase letter check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Lowercase letter');
    }

    // Set strength message and color
    let strengthMessage = '';
    let strengthColor = '';

    switch (score) {
      case 0:
      case 1:
        strengthMessage = 'Very Weak';
        strengthColor = '#ff4444';
        break;
      case 2:
        strengthMessage = 'Weak';
        strengthColor = '#ffbb33';
        break;
      case 3:
        strengthMessage = 'Moderate';
        strengthColor = '#ffbb33';
        break;
      case 4:
        strengthMessage = 'Strong';
        strengthColor = '#00C851';
        break;
      case 5:
        strengthMessage = 'Very Strong';
        strengthColor = '#007E33';
        break;
      default:
        break;
    }

    return {
      score,
      message: strengthMessage,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : '',
      color: strengthColor
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if password meets minimum requirements (score >= 3)
    const strength = checkPasswordStrength(formData.password);
    if (strength.score < 3) {
      setMessage({
        text: 'Password is too weak. Please create a stronger password.',
        type: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration data:', formData);

      const response = await axios.post(ENDPOINTS.REGISTER, formData);
      console.log('Registration response:', response.data);

      setMessage({ 
        text: 'Registration successful! Redirecting to login...', 
        type: 'success' 
      });

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
      <button className="back-button" onClick={() => navigate('/')}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="auth-card">
        <h2>Register</h2>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              required
              placeholder="Enter account name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Enter username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              disabled={loading}
            />
            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div style={{ 
                    height: '100%', 
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                    transition: 'all 0.3s ease'
                  }}></div>
                </div>
                <div className="password-strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message}
                </div>
                {passwordStrength.feedback && (
                  <div className="password-strength-feedback">
                    {passwordStrength.feedback}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
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
      </div>
    </div>
  );
};

export default Register;
