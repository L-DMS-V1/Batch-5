// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element, roleRequired }) => {
  const token = localStorage.getItem('token');
  
  // For demonstration purposes, allow access if there's no token
  if (!token) {
    console.warn('No token found. Allowing access for demonstration.');
    return element;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if (userRole !== roleRequired) {
      console.warn('Role mismatch. Allowing access for demonstration.');
      return element;
    }

    return element;
  } catch (error) {
    console.error('Invalid token', error);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;