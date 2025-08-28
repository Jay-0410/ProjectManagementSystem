import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Don't show loading screen - let the AuthContext handle it silently
  if (loading) {
    return null; // Return nothing while checking auth status
  }

  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
