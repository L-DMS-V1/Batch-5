import React, { useState } from 'react';
import { axiosInstance, ENDPOINTS } from '../config/api';
import '../styles/Modal.css';
import '../styles/Auth.css';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: '',
    feedback: []
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

    setPasswordStrength({
      score,
      message: strengthMessage,
      color: strengthColor,
      feedback: feedback.join(', ')
    });

    return score;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({
        score: 0,
        message: '',
        color: '',
        feedback: []
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check password strength
    const strengthScore = checkPasswordStrength(newPassword);
    if (strengthScore < 3) {
      setMessage({ text: 'Password is too weak. Please make it stronger.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(ENDPOINTS.SET_PASSWORD, { password: newPassword });
      setMessage({ text: 'Password changed successfully', type: 'success' });
      setTimeout(() => {
        onClose();
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ text: '', type: '' });
        setPasswordStrength({
          score: 0,
          message: '',
          color: '',
          feedback: []
        });
      }, 1500);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error changing password', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
            />
            {newPassword && (
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
                    Missing: {passwordStrength.feedback}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          <div className="modal-buttons">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || passwordStrength.score < 3}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
