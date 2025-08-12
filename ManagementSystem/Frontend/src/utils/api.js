// API utility to handle authenticated requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  // In development, use proxy (relative URLs)
  // In production, use full API URL
  const url = import.meta.env.DEV ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/auth';
      return;
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // Auth methods
  login: (credentials) => {
    const url = import.meta.env.DEV ? '/backend/auth/login' : `${API_BASE_URL}/auth/login`;
    console.log('Logging in with URL:', url);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  signup: (userData) => {
    const url = import.meta.env.DEV ? '/backend/auth/signup' : `${API_BASE_URL}/auth/signup`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  // Project methods
  getProjects: () => 
    apiRequest('/api/project'),

  getProject: (projectId) => 
    apiRequest(`/api/project/${projectId}`),

  createProject: (projectData) => 
    apiRequest('/api/project', {
      method: 'POST',
      body: JSON.stringify(projectData)
    }),

  updateProject: (projectId, projectData) => 
    apiRequest(`/api/project/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData)
    }),

  deleteProject: (projectId) => 
    apiRequest(`/api/project/${projectId}`, {
      method: 'DELETE'
    }),

  // Issue/Task methods
  getIssue: (issueId) => 
    apiRequest(`/api/issues/${issueId}`),

  getProjectIssues: (projectId) => 
    apiRequest(`/api/issues/project/${projectId}`),

  createIssue: (issueData) => 
    apiRequest('/api/issues', {
      method: 'POST',
      body: JSON.stringify(issueData)
    }),

  updateIssue: (issueId, issueData) => 
    apiRequest(`/api/issues/${issueId}`, {
      method: 'PUT',
      body: JSON.stringify(issueData)
    }),

  deleteIssue: (issueId) => 
    apiRequest(`/api/issues/${issueId}`, {
      method: 'DELETE'
    }),

  // Project methods
  getAllProjects: () => 
    apiRequest('/api/projects'),

  getProjectById: (projectId) => 
    apiRequest(`/api/projects/${projectId}`),

  createProject: (projectData) => 
    apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    }),

  updateProject: (projectId, projectData) => 
    apiRequest(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    }),

  deleteProject: (projectId) => 
    apiRequest(`/api/projects/${projectId}`, {
      method: 'DELETE'
    }),

  getProjectsByCategory: (category) => 
    apiRequest(`/api/projects/category/${category}`),

  searchProjects: (keyword) => 
    apiRequest(`/api/projects/search?keyword=${encodeURIComponent(keyword)}`),

  getProjectTeamMembers: (projectId) => 
    apiRequest(`/api/projects/${projectId}/team`),

  addTeamMember: (projectId, userId) => 
    apiRequest(`/api/projects/${projectId}/team/${userId}`, {
      method: 'POST'
    }),

  removeTeamMember: (projectId, userId) => 
    apiRequest(`/api/projects/${projectId}/team/${userId}`, {
      method: 'DELETE'
    }),

  // User methods
  getUserProfile: () => 
    apiRequest('/api/users/profile'),
};
