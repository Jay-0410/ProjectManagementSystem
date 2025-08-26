import { shouldUseMockData, DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders, isAuthenticated } from '../config/dataSource';
import { 
  mockProjects, 
  getProjectById as getMockProjectById,
  getProjectsByCategory as getMockProjectsByCategory,
  searchProjects as searchMockProjects,
  getProjectsByStatus as getMockProjectsByStatus
} from '../utils/mockProjectData';

// Simulate network delay for mock data
const simulateDelay = (data) => {
  if (shouldUseMockData() && DATA_SOURCE_CONFIG.mockDelay > 0) {
    return new Promise(resolve => {
      setTimeout(() => resolve(data), DATA_SOURCE_CONFIG.mockDelay);
    });
  }
  return Promise.resolve(data);
};

// API service functions
const apiService = {
  // Get all projects
  getAllProjects: async () => {
    if (shouldUseMockData()) {
      return simulateDelay(mockProjects);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.projects);
    const headers = getAuthHeaders();
    const rawTokenOld = localStorage.getItem('authToken');
    const rawTokenNew = localStorage.getItem('token');
    
    console.log('🌐 Making getAllProjects request to:', url);
    console.log('🔐 Authentication status:', isAuthenticated() ? 'Token present' : 'No token found');
    console.log('🔑 Raw token from localStorage (authToken):', rawTokenOld ? `${rawTokenOld.substring(0, 20)}...` : 'null');
    console.log('🔑 Raw token from localStorage (token):', rawTokenNew ? `${rawTokenNew.substring(0, 20)}...` : 'null');
    console.log('📡 Request headers being sent:', headers);
    console.log('📡 Authorization header specifically:', headers.Authorization || 'NOT SET');
    
    const response = await fetch(url, {
      headers: headers,
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log('❌ Full response object:', response);
      
      // Try to get more detailed error information
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log('❌ Error response body:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.log('❌ Could not parse error response as JSON');
        errorMessage = response.statusText || errorMessage;
      }
      
      // Specific handling for 403 Forbidden
      if (response.status === 403) {
        console.log('🚫 403 Forbidden - Authentication/Authorization issue');
        console.log('🔍 Check if:');
        console.log('   1. Token is valid and not expired');
        console.log('   2. User has permission to access projects');
        console.log('   3. Backend CORS configuration allows the request');
        console.log('   4. Token format matches backend expectations');
        
        if (!isAuthenticated()) {
          throw new Error('Authentication required. Please log in first.');
        } else {
          throw new Error('Access denied. You may not have permission to view projects or your session may have expired.');
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ Projects loaded successfully:', result);
    return result;
  },

  // Get project by ID
  getProjectById: async (id) => {
    if (shouldUseMockData()) {
      const project = getMockProjectById(id);
      return simulateDelay(project);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.projectById.replace('{id}', id));
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get projects by category
  getProjectsByCategory: async (category) => {
    if (shouldUseMockData()) {
      const projects = getMockProjectsByCategory(category);
      return simulateDelay(projects);
    }
    
    const url = getApiUrl(`${DATA_SOURCE_CONFIG.endpoints.projects}?catagory=${category}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Search projects
  searchProjects: async (keyword) => {
    if (shouldUseMockData()) {
      const projects = searchMockProjects(keyword);
      return simulateDelay(projects);
    }
    
    const url = getApiUrl(`${DATA_SOURCE_CONFIG.endpoints.searchProjects}?keyword=${encodeURIComponent(keyword)}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get projects by status (using tag parameter in backend)
  getProjectsByStatus: async (status) => {
    if (shouldUseMockData()) {
      const projects = getMockProjectsByStatus(status);
      return simulateDelay(projects);
    }
    
    const url = getApiUrl(`${DATA_SOURCE_CONFIG.endpoints.projects}?tag=${status}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Create new project
  createProject: async (projectData) => {
    if (shouldUseMockData()) {
      // For mock data, just return the project with a generated ID
      const newProject = { 
        ...projectData, 
        id: Date.now(), 
        projectId: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: projectData.status || 'ACTIVE',
        owner: {
          id: 1,
          fullName: "Mock User",
          email: "user@example.com"
        },
        team: [],
        issues: []
      };
      console.log('📝 Mock project created:', newProject);
      return simulateDelay(newProject);
    }
    
    console.log('🌐 Sending POST request to server:', getApiUrl(DATA_SOURCE_CONFIG.endpoints.createProject));
    console.log('📊 Request data:', projectData);
    console.log('🔐 Authentication:', isAuthenticated() ? 'Token present' : 'No token found');
    
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.createProject), {
      method: 'POST',
      headers: getAuthHeaders(), // This now includes authentication token
      body: JSON.stringify(projectData),
    });
    
    console.log('📡 Server response status:', response.status);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      console.error('❌ Server error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ Project created successfully:', result);
    return result;
  },

  // Update project
  updateProject: async (id, projectData) => {
    if (shouldUseMockData()) {
      const updatedProject = { ...projectData, id, projectId: id };
      return simulateDelay(updatedProject);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.updateProject.replace('{id}', id));
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Delete project
  deleteProject: async (id) => {
    if (shouldUseMockData()) {
      return simulateDelay({ success: true, message: 'Project deleted successfully' });
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.deleteProject.replace('{id}', id));
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get project chat
  getProjectChat: async (id) => {
    if (shouldUseMockData()) {
      return simulateDelay({ 
        id: 1, 
        projectId: id, 
        messages: [],
        name: `Project ${id} Chat`
      });
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.projectChat.replace('{id}', id));
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Invite user to project
  inviteToProject: async (projectId, email) => {
    if (shouldUseMockData()) {
      return simulateDelay({ message: 'Invitation sent successfully' });
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.inviteToProject.replace('{id}', projectId));
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Accept project invitation
  acceptInvitation: async (invitationToken) => {
    if (shouldUseMockData()) {
      return simulateDelay({ message: 'Invitation accepted successfully' });
    }
    
    const url = getApiUrl(`${DATA_SOURCE_CONFIG.endpoints.acceptInvitation}?invitationToken=${invitationToken}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export default apiService;
