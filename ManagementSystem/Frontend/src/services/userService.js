import { shouldUseMockData, DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders } from '../config/dataSource';

// Mock team members data
const mockTeamMembers = [
  {
    id: 1,
    username: "john.doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    isCurrentUser: true // Mark this as current user for testing
  },
  {
    id: 2,
    username: "jane.smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    isCurrentUser: false
  },
  {
    id: 3,
    username: "mike.johnson",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    fullName: "Mike Johnson",
    isCurrentUser: false
  },
  {
    id: 4,
    username: "sarah.wilson",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@example.com",
    fullName: "Sarah Wilson",
    isCurrentUser: false
  }
];

// Simulate network delay for mock data
const simulateDelay = (data) => {
  if (shouldUseMockData() && DATA_SOURCE_CONFIG.mockDelay > 0) {
    return new Promise(resolve => {
      setTimeout(() => resolve(data), DATA_SOURCE_CONFIG.mockDelay);
    });
  }
  return Promise.resolve(data);
};

const userService = {
  // Get all users/team members for a project
  getProjectTeamMembers: async (projectId) => {
    console.log('🔍 userService.getProjectTeamMembers called with projectId:', projectId);
    console.log('🔍 shouldUseMockData():', shouldUseMockData());
    
    if (shouldUseMockData()) {
      console.log('📝 Using mock data - Fetching mock team members for project:', projectId);
      console.log('📝 Mock team members data:', mockTeamMembers);
      const result = await simulateDelay(mockTeamMembers);
      console.log('✅ Mock team members returned:', result);
      return result;
    }
    
    console.log('🌐 Using real API - Fetching team members from backend');
    const url = getApiUrl(`/api/projects/${projectId}/members`);
    console.log('🌐 Request URL:', url);
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      console.error('❌ API request failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('✅ API team members returned:', result);
    return result;
  },

  // Get all users (for general assignment)
  getAllUsers: async () => {
    console.log('🔍 userService.getAllUsers called');
    console.log('🔍 shouldUseMockData():', shouldUseMockData());
    
    if (shouldUseMockData()) {
      console.log('📝 Using mock data - Fetching all mock users');
      console.log('📝 Mock users data:', mockTeamMembers);
      const result = await simulateDelay(mockTeamMembers);
      console.log('✅ Mock users returned:', result);
      return result;
    }
    
    console.log('🌐 Using real API - Fetching users from backend');
    const url = getApiUrl('/api/users');
    console.log('🌐 Request URL:', url);
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      console.error('❌ API request failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('✅ API users returned:', result);
    return result;
  },

  // Get user by ID
  getUserById: async (userId) => {
    if (shouldUseMockData()) {
      const user = mockTeamMembers.find(user => user.id === parseInt(userId));
      return simulateDelay(user || null);
    }
    
    const url = getApiUrl(`/api/users/${userId}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export { userService };
export default userService;
