/**
 * Task/Issue Testing Utilities (production build - debug code removed)
 */

// Simple backend health check
window.testBackendHealth = async function() {
  const baseURL = 'http://localhost:8080';
  
  try {
    const response = await fetch(`${baseURL}/api/project`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      return true;
    }
    
    return response.status < 500;
  } catch (error) {
    return false;
  }
};

// Test authentication status
window.checkTaskAuth = function() {
  const token = localStorage.getItem('token');
  return !!token;
};

// Test task creation with authentication
window.testTaskCreation = async function(projectId = 1) {
  if (typeof window.issueService === 'undefined') {
    try {
      const issueServiceModule = await import('/src/services/issueService.js');
      window.issueService = issueServiceModule.default;
    } catch (error) {
      return;
    }
  }

  const testTaskData = {
    title: 'Test Task - ' + new Date().toLocaleTimeString(),
    description: 'This is a test task created via debugging utility',
    status: 'TO_DO',
    priority: 'MEDIUM',
    projectId: parseInt(projectId),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    userId: null
  };

  try {
    const result = await window.issueService.createIssue(testTaskData, projectId);
    
    if (window.toast) {
      window.toast.success('Test task created successfully!');
    }
    
    return result;
  } catch (error) {
    if (window.toast) {
      window.toast.error('Task creation failed: ' + error.message);
    }
    
    throw error;
  }
};
