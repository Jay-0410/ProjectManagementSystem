import { DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders } from '../config/dataSource';

// API service functions
const apiService = {
  // Get all projects
  getAllProjects: async () => {
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.projects);
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
      headers: headers,
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  // Get project by ID
  getProjectById: async (id) => {
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
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.createProject), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  // Update project
  updateProject: async (id, projectData) => {
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
