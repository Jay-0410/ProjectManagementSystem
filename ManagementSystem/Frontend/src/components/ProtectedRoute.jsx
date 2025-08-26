import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">Authenticating...</p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
