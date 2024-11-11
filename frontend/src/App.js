import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute roleRequired="ADMIN" element={<AdminDashboard />} />
            } 
          />
          <Route 
            path="/manager-dashboard" 
            element={
              <ProtectedRoute roleRequired="MANAGER" element={<ManagerDashboard />} />
            } 
          />
          <Route 
            path="/employee-dashboard" 
            element={
              <ProtectedRoute roleRequired="EMPLOYEE" element={<EmployeeDashboard />} />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;