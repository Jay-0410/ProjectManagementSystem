import { shouldUseMockData, DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders, isAuthenticated } from '../config/dataSource';

// Mock issue data for development
const mockIssues = [
  {
    id: 1,
    title: "Setup Authentication System",
    description: "Implement JWT-based authentication for the application",
    status: "inProgress",
    priority: "high",
    dueDate: "2025-08-20",
    tags: ["authentication", "security", "backend"],
    assignee: {
      id: 1,
      username: "johndoe",
      firstName: "John",
      lastName: "Doe"
    }
  },
  {
    id: 2,
    title: "Create Project Dashboard",
    description: "Design and implement the main project dashboard UI",
    status: "toDo",
    priority: "medium",
    dueDate: "2025-08-25",
    tags: ["frontend", "ui", "dashboard"],
    assignee: null
  }
];

// Simulate network delay for mock data
const simulateDelay = (data) => {
  console.log('⏱️ simulateDelay called with:', data);
  console.log('⏱️ Mock delay enabled:', shouldUseMockData() && DATA_SOURCE_CONFIG.mockDelay > 0);
  
  if (shouldUseMockData() && DATA_SOURCE_CONFIG.mockDelay > 0) {
    console.log('⏱️ Applying delay:', DATA_SOURCE_CONFIG.mockDelay);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('⏱️ Delay completed, returning:', data);
        resolve(data);
      }, DATA_SOURCE_CONFIG.mockDelay);
    });
  }
  console.log('⏱️ No delay, returning immediately:', data);
  return Promise.resolve(data);
};

// Issue/Task API service functions
const issueService = {
  // Get all issues
  getAllIssues: async () => {
    if (shouldUseMockData()) {
      return simulateDelay(mockIssues);
    }
    
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.issues), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get issue by ID
  getIssueById: async (id) => {
    if (shouldUseMockData()) {
      const issue = mockIssues.find(issue => issue.id === parseInt(id));
      return simulateDelay(issue || null);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.issueById.replace('{id}', id));
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get issues by project ID
  getIssuesByProject: async (projectId) => {
    if (shouldUseMockData()) {
      // Filter mock issues for this project (mock data doesn't have projectId, so return all)
      return simulateDelay(mockIssues);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.issuesByProject.replace('{projectId}', projectId));
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Create new issue/task
  createIssue: async (issueData, projectId) => {
    console.log('🔍 createIssue called with:', {issueData, projectId});
    console.log('🔍 shouldUseMockData():', shouldUseMockData());
    
    if (shouldUseMockData()) {
      console.log('📝 Using mock data path');
      console.log('📝 Input issueData:', issueData);
      console.log('📝 Input issueData type:', typeof issueData);
      console.log('📝 Input issueData keys:', Object.keys(issueData));
      
      // Check each property of issueData
      Object.keys(issueData).forEach(key => {
        const value = issueData[key];
        console.log(`📝 Property ${key}:`, typeof value, value);
        if (typeof value === 'object' && value !== null) {
          console.log(`📝 Object property ${key} details:`, {
            constructor: value.constructor.name,
            keys: Object.keys(value),
            stringified: JSON.stringify(value)
          });
        }
      });
      
      const newIssue = { 
        ...issueData, 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: null
      };
      console.log('📝 Mock issue created:', newIssue);
      
      // Test JSON serialization of the new issue
      try {
        const testJson = JSON.stringify(newIssue);
        console.log('✅ Mock issue JSON serialization successful');
        console.log('📄 Mock issue JSON:', testJson);
      } catch (jsonError) {
        console.error('❌ Mock issue JSON serialization failed:', jsonError);
        console.error('❌ Problematic data:', newIssue);
        throw new Error('Mock data JSON serialization failed: ' + jsonError.message);
      }
      
      return simulateDelay(newIssue);
    }
    
    console.log('🌐 Using real API path');
    console.log('🌐 Sending POST request to create issue:', getApiUrl(DATA_SOURCE_CONFIG.endpoints.createIssue));
    console.log('📊 Raw issue data received:', issueData);
    console.log('📊 ProjectId received:', projectId);
    
    // Sanitize and validate the data to prevent JSON serialization errors
    const sanitizedData = {
      title: String(issueData.title || '').trim(),
      description: String(issueData.description || '').trim(),
      status: String(issueData.status || 'TO_DO').trim(),
      priority: String(issueData.priority || 'MEDIUM').trim(),
      projectId: parseInt(projectId) || parseInt(issueData.projectId) || null,
      dueDate: issueData.dueDate || null,
      assignee:  {username: issueData.assigneeUsername || '',}
    };
    
    console.log('🔍 Sanitized data for backend:', sanitizedData);
    console.log('🔍 Field validation:');
    console.log('   title (string):', typeof sanitizedData.title, sanitizedData.title);
    console.log('   description (string):', typeof sanitizedData.description, sanitizedData.description);
    console.log('   status (string):', typeof sanitizedData.status, sanitizedData.status);
    console.log('   priority (string):', typeof sanitizedData.priority, sanitizedData.priority);
    console.log('   projectId (number):', typeof sanitizedData.projectId, sanitizedData.projectId);
    console.log('   dueDate:', typeof sanitizedData.dueDate, sanitizedData.dueDate);
    console.log('   userId (assignee):', typeof sanitizedData.userId, sanitizedData.userId);
    console.log('   assigneeUsername:', issueData.assigneeUsername);
    console.log('   assigneeDetails:', issueData.assigneeDetails);
    console.log('🔐 Authentication:', isAuthenticated() ? 'Token present' : 'No token found');
    
    // Validate required fields
    if (!sanitizedData.title) {
      throw new Error('Title is required and cannot be empty');
    }
    if (!sanitizedData.projectId) {
      throw new Error('Project ID is required');
    }
    
    // Test JSON serialization before sending
    let jsonString;
    try {
      jsonString = JSON.stringify(sanitizedData);
      console.log('✅ JSON serialization test successful');
      console.log('📄 JSON string to be sent:', jsonString);
    } catch (jsonError) {
      console.error('❌ JSON serialization failed:', jsonError);
      console.error('❌ Problematic data:', sanitizedData);
      throw new Error('Data cannot be serialized to JSON: ' + jsonError.message);
    }
    
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.createIssue), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: jsonString, // Use pre-serialized JSON
    });
    
    console.log('📡 Server response status:', response.status);
    console.log('📡 Server response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      console.error('❌ Final error message:', errorMessage);
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
      console.error('🚨 Detected malformed JSON pattern in issue response!');
      console.error('🚨 Pattern location:', rawResponse.indexOf(']}]}}]}}]}"'));
      const problemArea = rawResponse.substring(
        Math.max(0, rawResponse.indexOf(']}]}}]}}]}"') - 50),
        rawResponse.indexOf(']}]}}]}}]}"') + 100
      );
      console.error('🚨 Problem area context:', problemArea);
      throw new Error('Backend returned malformed JSON with nested bracket pattern in issue creation. Raw response logged in console.');
    }
    
    let result;
    try {
      result = JSON.parse(rawResponse);
      console.log('✅ Issue JSON parsing successful');
    } catch (jsonError) {
      console.error('❌ Issue JSON parsing failed:', jsonError);
      console.error('❌ Raw response that failed to parse:', rawResponse);
      throw new Error(`Failed to parse issue JSON response: ${jsonError.message}. Raw response logged in console.`);
    }
    
    console.log('✅ Issue created successfully:', result);
    return result;
  },

  // Update issue
  updateIssue: async (id, issueData) => {
    if (shouldUseMockData()) {
      const updatedIssue = { ...issueData, id, updatedAt: new Date().toISOString() };
      return simulateDelay(updatedIssue);
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.updateIssue.replace('{id}', id));
    const response = await fetch(url, {
      method: 'PUT',
      params: {
        issueId:id,
      },
      headers: getAuthHeaders(),
      body: JSON.stringify(issueData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Delete issue
  deleteIssue: async (id) => {
    console.log('🗑️ deleteIssue called with id:', id);
    
    if (shouldUseMockData()) {
      console.log('📝 Using mock data for delete');
      return simulateDelay({ success: true, message: 'Issue deleted successfully' });
    }

    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.deleteIssue.replace('{id}', id));
    console.log('🌐 DELETE request to:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    console.log('📡 Delete response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('❌ Delete error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      
      // Handle specific authorization error from backend
      if (response.status === 403 || errorMessage.includes('cannot delete')) {
        throw new Error('You cannot delete this issue. Only the assignee can delete their assigned issues.');
      }
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ Issue deleted successfully:', result);
    return result;
  },

  // Update issue status
  updateIssueStatus: async (id, status) => {
    console.log('🔄 updateIssueStatus called with:', { id, status });
    
    if (shouldUseMockData()) {
      console.log('📝 Using mock data for status update');
      const updatedIssue = { id, status, updatedAt: new Date().toISOString() };
      return simulateDelay(updatedIssue);
    }

    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }

    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.updateIssueStatus
      .replace('{id}', id)
      .replace('{status}', status));
    
    console.log('🌐 PUT request to update status:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    console.log('📡 Status update response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('❌ Status update error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Issue status updated successfully:', result);
    return result;
  },

  // Assign issue to user
  assignIssue: async (issueId, userId) => {
    if (shouldUseMockData()) {
      return simulateDelay({ success: true, message: 'Issue assigned successfully' });
    }
    
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.assignIssue.replace('{issueId}', issueId).replace('{userId}', userId));
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Alias methods for task terminology
  getTaskById: function(id) {
    return this.getIssueById(id);
  },

  getTasksByProject: function(projectId) {
    return this.getIssuesByProject(projectId);
  },

  createTask: function(taskData) {
    return this.createIssue(taskData);
  },

  updateTask: function(id, taskData) {
    return this.updateIssue(id, taskData);
  },

  deleteTask: function(id) {
    return this.deleteIssue(id);
  },

  updateTaskStatus: function(id, status) {
    return this.updateIssueStatus(id, status);
  }
};

export { issueService };
export default issueService;
