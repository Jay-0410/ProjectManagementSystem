import { getApiUrl, setAuthToken, getAuthToken } from '../config/dataSource';

// Authentication service to work with your backend
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login with:', { username: credentials.username });
      
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Login response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Login failed:', errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const authResponse = await response.json();
      console.log('✅ Login successful:', authResponse);

      // Store the JWT token
      if (authResponse.jwt) {
        setAuthToken(authResponse.jwt);
        console.log('🔑 Token stored successfully');
      } else {
        console.warn('⚠️ No JWT token in response:', authResponse);
      }

      return authResponse;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // Register user
  signup: async (userData) => {
    try {
      console.log('📝 Attempting signup for:', userData.username);
      
      const response = await fetch(getApiUrl('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Signup response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Signup failed:', errorText);
        throw new Error(`Signup failed: ${response.status} ${errorText}`);
      }

      const authResponse = await response.json();
      console.log('✅ Signup successful:', authResponse);

      // Store the JWT token
      if (authResponse.jwt) {
        setAuthToken(authResponse.jwt);
        console.log('🔑 Token stored successfully');
      }

      return authResponse;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    setAuthToken(null);
    console.log('🚪 User logged out, token cleared');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = getAuthToken();
    return !!token;
  },

  // Get current token
  getToken: () => {
    return getAuthToken();
  },

  // Quick login for testing (creates a test user and logs in)
  quickTestLogin: async () => {
    try {
      console.log('🧪 Attempting quick test login...');
      
      // First try to signup a test user
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      try {
        await authService.signup(testUser);
        console.log('✅ Test user created and logged in');
        return true;
      } catch (signupError) {
        console.log('ℹ️ Signup failed (user might exist), trying login...');
        
        // If signup fails, try login
        try {
          await authService.login({
            username: testUser.username,
            password: testUser.password
          });
          console.log('✅ Test user logged in successfully');
          return true;
        } catch (loginError) {
          console.error('❌ Both signup and login failed:', loginError);
          throw loginError;
        }
      }
    } catch (error) {
      console.error('❌ Quick test login failed:', error);
      throw error;
    }
  }
};

// Make auth service available globally for testing
if (typeof window !== 'undefined') {
  window.authService = authService;
  console.log('🔧 Auth service available as window.authService');
  console.log('   Usage:');
  console.log('   - window.authService.quickTestLogin()');
  console.log('   - window.authService.login({username: "user", password: "pass"})');
  console.log('   - window.authService.isLoggedIn()');
  console.log('   - window.authService.logout()');
}

export default authService;
