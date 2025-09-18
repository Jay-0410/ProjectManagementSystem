import { DATA_SOURCE_CONFIG, getApiUrl, getAuthHeaders } from '../config/dataSource';

const issueService = {
  // Get all issues
  getAllIssues: async () => {
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
  createIssue: async (projectId, issueData) => {
    const sanitizedData = {
      title: String(issueData.title || '').trim(),
      description: String(issueData.description || '').trim(),
      status: String(issueData.status || 'TO_DO').trim(),
      priority: String(issueData.priority || 'MEDIUM').trim(),
      projectId: parseInt(projectId),
      dueDate: issueData.dueDate || null,
      assignee: { username: issueData.assigneeUsername || '' }
    };
    
    if (!sanitizedData.title) {
      throw new Error('Title is required and cannot be empty');
    }
    if (!sanitizedData.projectId) {
      throw new Error('Project ID is required');
    }
    
    const response = await fetch(getApiUrl(DATA_SOURCE_CONFIG.endpoints.createIssue), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sanitizedData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Update issue
  updateIssue: async (id, issueData) => {
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.updateIssue.replace('{id}', id));
    const response = await fetch(url, {
      method: 'PUT',
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
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.deleteIssue.replace('{id}', id));
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('You cannot delete this issue. Only the assignee can delete their assigned issues.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Update issue status
  updateIssueStatus: async (id, status) => {
    const url = getApiUrl(DATA_SOURCE_CONFIG.endpoints.updateIssueStatus
      .replace('{id}', id)
      .replace('{status}', status));
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Assign issue to user
  assignIssue: async (issueId, userId) => {
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

  createTask: function(projectId, taskData) {
    return this.createIssue(projectId, taskData);
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
