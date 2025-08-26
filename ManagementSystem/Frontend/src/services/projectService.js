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
    console.log('Response:', response);

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
    
    console.log('📡 Response Content-Type:', response.headers.get('content-type'));
    
    // Get the raw response text first to inspect it
    const rawResponse = await response.text();
    console.log('📄 Raw response text:', rawResponse);
    console.log('📄 Raw response length:', rawResponse.length);
    console.log('📄 Raw response first 200 chars:', rawResponse.substring(0, 200));
    console.log('📄 Raw response last 200 chars:', rawResponse.substring(Math.max(0, rawResponse.length - 200)));
    
    // Check for the problematic pattern
    if (rawResponse.includes(']}]}}]}}]}"')) {
      console.error('🚨 Detected malformed JSON pattern in response!');
      console.error('🚨 Pattern location:', rawResponse.indexOf(']}]}}]}}]}"'));
      const problemArea = rawResponse.substring(
        Math.max(0, rawResponse.indexOf(']}]}}]}}]}"') - 50),
        rawResponse.indexOf(']}]}}]}}]}"') + 100
      );
      console.error('🚨 Problem area context:', problemArea);
      throw new Error('Backend returned malformed JSON with nested bracket pattern. Raw response logged in console.');
    }
    
    let result;
    try {
      result = JSON.parse(rawResponse);
      console.log('✅ JSON parsing successful');
    } catch (jsonError) {
      console.error('❌ JSON parsing failed:', jsonError);
      console.error('❌ Raw response that failed to parse:', rawResponse);
      throw new Error(`Failed to parse JSON response: ${jsonError.message}. Raw response logged in console.`);
    }
    
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
    console.log('📊 Request data being sent to backend:', projectData);
    console.log('🔍 Field mapping check:');
    console.log('   name (backend expects this):', projectData.name);
    console.log('   tags (backend expects array):', projectData.tags);
    console.log('   tags type:', Array.isArray(projectData.tags) ? 'Array' : typeof projectData.tags);
    console.log('   tags length:', projectData.tags ? projectData.tags.length : 'undefined');
    console.log('   tags content:', JSON.stringify(projectData.tags));
    console.log('   category:', projectData.category);
    
    // ✅ MULTIPLE TAGS VALIDATION
    if (projectData.tags && Array.isArray(projectData.tags)) {
      console.log('🏷️ MULTIPLE TAGS VERIFICATION:');
      console.log('   ✅ Tags is an Array:', true);
      console.log('   ✅ Number of tags being sent:', projectData.tags.length);
      console.log('   ✅ Individual tags:');
      projectData.tags.forEach((tag, index) => {
        console.log(`      ${index + 1}. "${tag}" (${typeof tag})`);
      });
      console.log('   ✅ JSON string for backend:', JSON.stringify(projectData.tags));
      console.log('   ✅ Backend will receive as List<String>');
      
      if (projectData.tags.length === 0) {
        console.warn('⚠️ WARNING: No tags selected!');
      } else if (projectData.tags.length === 1) {
        console.log('ℹ️ INFO: Single tag selected');
      } else {
        console.log(`🎉 SUCCESS: ${projectData.tags.length} multiple tags ready for backend!`);
      }
    } else {
      console.error('❌ ERROR: Tags is not an array!', projectData.tags);
    }
    
    console.log('🔐 Authentication:', isAuthenticated() ? 'Token present' : 'No token found');
    console.log('📡 Request headers being sent:', getAuthHeaders());
    console.log('📊 Request body being sent:', JSON.stringify(projectData));
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.createProject), {
      method: 'POST',
      headers: getAuthHeaders(), // This now includes authentication token
      body: JSON.stringify(projectData),
    });
    
    console.log('📡 Server response status:', response.status);
    
    if (!response.ok) {
      console.log('❌ Full response object:', response);
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
    
    // ✅ VERIFY MULTIPLE TAGS WERE STORED CORRECTLY
    console.log('🔍 BACKEND RESPONSE VERIFICATION:');
    console.log('   📊 Full response:', result);
    console.log('   🏷️ Tags returned by backend:', result.tags);
    console.log('   🏷️ Backend tags type:', Array.isArray(result.tags) ? 'Array' : typeof result.tags);
    console.log('   🏷️ Backend tags count:', result.tags ? result.tags.length : 'undefined');
    
    if (result.tags && Array.isArray(result.tags)) {
      console.log('   ✅ Backend successfully stored tags as List<String>');
      console.log('   🏷️ Stored tags:');
      result.tags.forEach((tag, index) => {
        console.log(`      ${index + 1}. "${tag}"`);
      });
      
      // Compare sent vs received tags
      const sentTags = projectData.tags || [];
      const receivedTags = result.tags || [];
      const tagsMatch = sentTags.length === receivedTags.length && 
                        sentTags.every(tag => receivedTags.includes(tag));
      
      console.log('   🔍 Tags comparison:');
      console.log('      Sent:', sentTags);
      console.log('      Received:', receivedTags);
      console.log('      Match:', tagsMatch ? '✅ YES' : '❌ NO');
      
      if (!tagsMatch) {
        console.warn('⚠️ WARNING: Sent and received tags do not match!');
      } else {
        console.log('🎉 SUCCESS: All multiple tags correctly sent and stored!');
      }
    } else {
      console.error('❌ ERROR: Backend did not return tags as expected array');
    }
    
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

  // Delete project
  deleteProject: async (projectId) => {
    if (shouldUseMockData()) {
      // For mock data, we'll simulate successful deletion
      return simulateDelay({ 
        message: 'Project deleted successfully',
        projectId: projectId 
      });
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.deleteProject.replace('{id}', projectId));
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Return the response data or a success message
    const data = await response.json().catch(() => ({}));
    return data.message ? data : { message: 'Project deleted successfully' };
  },
};

export default apiService;
