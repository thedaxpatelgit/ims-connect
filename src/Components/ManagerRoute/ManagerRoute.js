import React from 'react';
import { Navigate } from 'react-router-dom';

// This component restricts access based on the user's role
const ManagerRoute = ({ children }) => {
  const role = localStorage.getItem('role'); // Get the user's role from localStorage

  return role === 'Manager' ? children : <Navigate to="/dashboard" />;
};

export default ManagerRoute;
