import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default Unauthorized; 