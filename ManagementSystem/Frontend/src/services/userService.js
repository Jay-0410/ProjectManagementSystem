import { DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders } from '../config/dataSource';

// User service for API operations
const userService = {
  // Get all users/team members for a project
  getProjectTeamMembers: async (projectId) => {
    const url = getApiUrl(`/api/projects/${projectId}/members`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get all users (for general assignment)
  getAllUsers: async () => {
    const url = getApiUrl('/api/users');
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get user by ID
  getUserById: async (userId) => {
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
