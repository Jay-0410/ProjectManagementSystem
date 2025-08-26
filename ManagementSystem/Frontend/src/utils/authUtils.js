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

  // For development/testing: Set a mock token
  setMockToken: () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setAuthToken(mockToken);
    console.log('🧪 Mock token set for testing');
    return mockToken;
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
