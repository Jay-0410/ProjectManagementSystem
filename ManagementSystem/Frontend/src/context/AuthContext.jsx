import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context with a default value
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app startup
    const checkAuthStatus = () => {
      const savedToken = localStorage.getItem('token');
      const savedUsername = localStorage.getItem('username');

      if (savedToken && savedUsername) {
        setToken(savedToken);
        setUser({ username: savedUsername });
      }
      
      setLoading(false);
    };

    // Slight delay to prevent flash, but quick enough to avoid noticeable lag
    const timeoutId = setTimeout(checkAuthStatus, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setToken(token);
    setUser({ username });
    setLoading(false); // Immediately set loading to false after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
