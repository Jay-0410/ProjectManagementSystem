import { setAuthToken, getAuthToken, isAuthenticated } from '../config/dataSource';

// Authentication utility functions
export const authUtils = {
  // Set authentication token (call this after successful login)
  login: (token) => {
    setAuthToken(token);
    console.log('🔐 Authentication token set');
  },

  // Remove authentication token (call this on logout)
  logout: () => {
    setAuthToken(null);
    console.log('🔓 Authentication token removed');
  },

  // Check if user is authenticated
  isLoggedIn: () => {
    return isAuthenticated();
  },

  // Get current token
  getToken: () => {
    return getAuthToken();
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('authToken');
    console.log('🧹 All authentication data cleared');
  },
};

// Auto-check authentication on app load
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    console.log('🔐 Found existing authentication token');
    return true;
  } else {
    console.log('🔓 No authentication token found');
    return false;
  }
};

export default authUtils;
