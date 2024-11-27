import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route path="/admin/*" element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/manager/*" element={
          <PrivateRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/employee/*" element={
          <PrivateRoute allowedRoles={['EMPLOYEE']}>
            <EmployeeDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;