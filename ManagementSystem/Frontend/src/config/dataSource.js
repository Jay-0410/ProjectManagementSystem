// Data Source Configuration
// Change this flag to switch between mock data and server data
export const USE_MOCK_DATA = false; // Set to true temporarily to debug the JSON issue and enable team member data

// You can also use environment variables for different environments
// export const USE_MOCK_DATA = import.meta.env.DEV;

export const DATA_SOURCE_CONFIG = {
  // API endpoints (used when USE_MOCK_DATA is false)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  endpoints: {
    projects: '/api/project',
    projectById: '/api/project/{id}',
    createProject: '/api/project',
    updateProject: '/api/project/{id}',
    deleteProject: '/api/project/{id}',
    searchProjects: '/api/project/search',
    projectChat: '/api/project/{id}/chat',
    inviteToProject: '/api/project/{id}/invite',
    acceptInvitation: '/api/project/accept_invitation',
    // Issue/Task endpoints
    issues: '/api/issues',
    issueById: '/api/issues/{id}',
    createIssue: '/api/issues',
    updateIssue: '/api/issues/{id}',
    deleteIssue: '/api/issues/{id}',
    updateIssueStatus: '/api/issues/{id}/status/{status}',
    issuesByProject: '/api/issues/project/{projectId}',
    assignIssue: '/api/issues/{issueId}/assignee/{userId}',
    // Add more endpoints as needed
  },
  
  // API configuration
  timeout: 10000, // 10 seconds
  retries: 3,
  
  // Authentication configuration
  auth: {
    tokenKey: 'token', // Key used to store token in localStorage (changed from 'authToken' to 'token')
    headerName: 'Authorization', // Header name for token
    tokenPrefix: 'Bearer ', // Prefix for token (e.g., 'Bearer ', 'Token ', or empty string)
  },
  
  // Mock data configuration
  mockDelay: 500, // Simulate network delay in milliseconds (0 to disable)
};

// Helper function to determine if we should use mock data
export const shouldUseMockData = () => {
  return USE_MOCK_DATA;
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => {
  return `${DATA_SOURCE_CONFIG.API_BASE_URL}${endpoint}`;
};

// Authentication helper functions
export const getAuthToken = () => {
  return localStorage.getItem(DATA_SOURCE_CONFIG.auth.tokenKey);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(DATA_SOURCE_CONFIG.auth.tokenKey, token);
  } else {
    localStorage.removeItem(DATA_SOURCE_CONFIG.auth.tokenKey);
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers[DATA_SOURCE_CONFIG.auth.headerName] = `${DATA_SOURCE_CONFIG.auth.tokenPrefix}${token}`;
  }
  
  return headers;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
