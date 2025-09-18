// Authentication debugging utilities (production build - debug code removed)
import { getAuthToken, setAuthToken, isAuthenticated, getAuthHeaders } from '../config/dataSource';

export const authDebugUtils = {
  // Check current authentication status
  checkAuthStatus: () => {
    return {
      hasToken: isAuthenticated(),
      token: getAuthToken(),
      headers: getAuthHeaders()
    };
  },

  // Clear token
  clearToken: () => {
    setAuthToken(null);
    return authDebugUtils.checkAuthStatus();
  }
};

export default authDebugUtils;
