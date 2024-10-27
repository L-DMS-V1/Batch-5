import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';
import '../styles/Register.css';

const Register = () => {
  const [accountId, setAccountId] = useState(''); // Keep accountId as a string for user input
  const [accountName, setAccountName] = useState(''); // Keep accountName as a string
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(ENDPOINTS.REGISTER, {
        accountId: parseInt(accountId, 10), // Convert accountId to an integer
        accountName,
        userName:username,
        password,
        email,
        role
      });
      console.log('Registration successful', response.status);
      navigate('/login'); // Navigate to login after successful registration
    } catch (error) {
      console.error('Registration failed', error.response?.status);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)} // Use accountName
          placeholder="Account Name"
          required
        />
        <input
          type="text" // Keep accountId as a text input for user entry
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)} // Use accountId
          placeholder="Account ID"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
