import { getApiUrl, setAuthToken, getAuthToken } from '../config/dataSource';

// Authentication service to work with your backend
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const authResponse = await response.json();

      // Store the JWT token
      if (authResponse.jwt) {
        setAuthToken(authResponse.jwt);
      }

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  signup: async (userData) => {
    try {
      const response = await fetch(getApiUrl('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Signup failed: ${response.status} ${errorText}`);
      }

      const authResponse = await response.json();

      // Store the JWT token
      if (authResponse.jwt) {
        setAuthToken(authResponse.jwt);
      }

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    setAuthToken(null);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = getAuthToken();
    return !!token;
  },

  // Get current token
  getToken: () => {
    return getAuthToken();
  }
};

export default authService;
