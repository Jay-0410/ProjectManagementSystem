/**
 * Task/Issue Creation Testing Utilities
 * 
 * Use these functions in the browser console to test task creation functionality
 * with proper authentication and backend integration.
 */

// Simple backend health check
window.testBackendHealth = async function() {
  console.log('🏥 Testing backend health...');
  
  const baseURL = 'http://localhost:8080';
  
  try {
    // Test if backend is running at all
    console.log('📡 Checking if backend is running...');
    const response = await fetch(`${baseURL}/api/project`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend is responding');
    console.log('📡 Status:', response.status);
    
    if (response.status === 401 || response.status === 403) {
      console.log('🔐 Backend requires authentication (this is expected)');
      return true;
    }
    
    return response.status < 500;
  } catch (error) {
    console.error('❌ Backend is not running or not accessible:', error);
    console.error('🔧 Make sure:');
    console.error('   1. Spring Boot backend is running on port 8080');
    console.error('   2. CORS is properly configured');
    console.error('   3. No firewall blocking the connection');
    return false;
  }
};

// Test backend connectivity and response format
window.testBackendConnectivity = async function() {
  console.log('🌐 Testing backend connectivity...');
  
  const baseURL = 'http://localhost:8080';
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No authentication token found');
    return false;
  }
  
  try {
    console.log('📡 Testing projects endpoint...');
    const response = await fetch(`${baseURL}/api/project`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📡 Response Content-Type:', response.headers.get('content-type'));
    
    // Get raw response text
    const rawText = await response.text();
    console.log('📄 Raw response text:', rawText);
    console.log('📄 Response length:', rawText.length);
    
    if (rawText.length > 0) {
      console.log('📄 First 500 chars:', rawText.substring(0, 500));
      console.log('📄 Last 500 chars:', rawText.substring(Math.max(0, rawText.length - 500)));
      
      // Check for the problematic pattern
      if (rawText.includes(']}]}}]}}]}"')) {
        console.error('🚨 Found malformed JSON pattern in backend response!');
        const patternIndex = rawText.indexOf(']}]}}]}}]}"');
        console.error('🚨 Pattern starts at position:', patternIndex);
        const context = rawText.substring(Math.max(0, patternIndex - 100), patternIndex + 200);
        console.error('🚨 Context around pattern:', context);
        return false;
      }
      
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(rawText);
        console.log('✅ Backend response is valid JSON');
        console.log('📊 Parsed data:', jsonData);
        return true;
      } catch (parseError) {
        console.error('❌ Backend response is not valid JSON:', parseError);
        console.error('❌ Parse error position:', parseError.message);
        return false;
      }
    } else {
      console.log('⚠️ Backend returned empty response');
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error);
    return false;
  }
};

// Test minimal task creation to isolate JSON issue
window.testMinimalTaskCreation = async function() {
  console.log('🧪 Testing minimal task creation...');
  
  const minimalData = {
    title: 'Test',
    description: 'Test desc',
    status: 'TO_DO',
    priority: 'MEDIUM'
  };
  
  console.log('📊 Minimal data:', minimalData);
  
  // Test JSON serialization of minimal data
  try {
    const jsonString = JSON.stringify(minimalData);
    console.log('✅ Minimal data JSON serialization successful:', jsonString);
  } catch (error) {
    console.error('❌ Minimal data JSON serialization failed:', error);
    return false;
  }
  
  // Load issue service
  try {
    const issueServiceModule = await import('/src/services/issueService.js');
    const issueService = issueServiceModule.default;
    console.log('✅ Issue service loaded');
    
    // Call createIssue with minimal data
    const result = await issueService.createIssue(minimalData, 1);
    console.log('✅ Minimal task creation successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Minimal task creation failed:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
};

// Test task creation with authentication
window.testTaskCreation = async function(projectId = 1) {
  console.log('🧪 Testing task creation...');
  
  // Check if issue service is available
  if (typeof window.issueService === 'undefined') {
    try {
      const issueServiceModule = await import('/src/services/issueService.js');
      window.issueService = issueServiceModule.default;
      console.log('✅ Issue service loaded');
    } catch (error) {
      console.error('❌ Failed to load issue service:', error);
      return;
    }
  }

  // Test data with clean, simple types
  const testTaskData = {
    title: 'Test Task - ' + new Date().toLocaleTimeString(),
    description: 'This is a test task created via debugging utility',
    status: 'TO_DO',
    priority: 'MEDIUM',
    projectId: parseInt(projectId),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    userId: null
  };

  console.log('📤 Test task data:', testTaskData);
  console.log('📤 Data types check:');
  Object.keys(testTaskData).forEach(key => {
    console.log(`  ${key}:`, typeof testTaskData[key], testTaskData[key]);
  });

  // Test JSON serialization
  try {
    const jsonString = JSON.stringify(testTaskData);
    console.log('✅ JSON serialization test passed');
    console.log('📄 JSON string:', jsonString);
  } catch (jsonError) {
    console.error('❌ JSON serialization failed:', jsonError);
    return;
  }

  try {
    const result = await window.issueService.createIssue(testTaskData, projectId);
    console.log('✅ Task created successfully:', result);
    
    // Show success message
    if (window.toast) {
      window.toast.success('Test task created successfully!');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Task creation failed:', error);
    
    // Show error message
    if (window.toast) {
      window.toast.error('Task creation failed: ' + error.message);
    }
    
    throw error;
  }
};

// Test authentication status
window.checkTaskAuth = function() {
  console.log('🔐 Checking authentication for task creation...');
  
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  console.log('Authentication status:', {
    hasToken: isAuthenticated,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
  });
  
  if (!isAuthenticated) {
    console.warn('⚠️ No authentication token found. Task creation will fail.');
    return false;
  }
  
  console.log('✅ Authentication token found');
  return true;
};

// Test fetching tasks for a project
window.testFetchTasks = async function(projectId = 1) {
  console.log('🔍 Testing task fetching for project:', projectId);
  
  // Check if issue service is available
  if (typeof window.issueService === 'undefined') {
    try {
      const issueServiceModule = await import('/src/services/issueService.js');
      window.issueService = issueServiceModule.default;
      console.log('✅ Issue service loaded');
    } catch (error) {
      console.error('❌ Failed to load issue service:', error);
      return;
    }
  }

  try {
    const tasks = await window.issueService.getIssuesByProject(projectId);
    console.log('✅ Tasks fetched successfully:', tasks);
    console.log('📊 Task count:', tasks.length);
    
    if (tasks.length > 0) {
      console.log('📋 Sample task structure:', tasks[0]);
    }
    
    return tasks;
  } catch (error) {
    console.error('❌ Failed to fetch tasks:', error);
    throw error;
  }
};

// Test backend API connectivity
window.testTaskAPI = async function() {
  console.log('🌐 Testing task API connectivity...');
  
  const baseURL = 'http://localhost:8080';
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No authentication token found');
    return false;
  }
  
  try {
    // Test GET request to issues endpoint
    const response = await fetch(`${baseURL}/api/issues/project/1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connectivity test successful');
      console.log('📊 Sample API response:', data);
      return true;
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    return false;
  }
};

// Comprehensive task system test
window.runTaskSystemTest = async function(projectId = 1) {
  console.log('🚀 Running comprehensive task system test...');
  
  // Step 1: Check authentication
  console.log('\n--- Step 1: Authentication Check ---');
  const authOk = window.checkTaskAuth();
  if (!authOk) {
    console.error('❌ Authentication check failed. Aborting test.');
    return false;
  }
  
  // Step 2: Test API connectivity
  console.log('\n--- Step 2: API Connectivity Test ---');
  const apiOk = await window.testTaskAPI();
  if (!apiOk) {
    console.error('❌ API connectivity test failed. Aborting test.');
    return false;
  }
  
  // Step 3: Test fetching existing tasks
  console.log('\n--- Step 3: Fetch Existing Tasks ---');
  try {
    await window.testFetchTasks(projectId);
  } catch (error) {
    console.error('❌ Task fetching test failed:', error);
  }
  
  // Step 4: Test creating a new task
  console.log('\n--- Step 4: Create New Task ---');
  try {
    const newTask = await window.testTaskCreation(projectId);
    console.log('✅ New task created:', newTask);
    
    // Step 5: Verify the task was created by fetching again
    console.log('\n--- Step 5: Verify Task Creation ---');
    await window.testFetchTasks(projectId);
    
    console.log('\n🎉 All task system tests completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Task creation test failed:', error);
    return false;
  }
};

// Test form data serialization
window.testFormDataSerialization = function(formData) {
  console.log('🔍 Testing form data serialization...');
  console.log('📋 Raw form data:', formData);
  
  // Check each field type
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    console.log(`  ${key}:`, typeof value, value);
    
    // Check if it's a complex object
    if (typeof value === 'object' && value !== null) {
      console.log(`    ⚠️ ${key} is an object:`, value);
      console.log(`    ⚠️ Object keys:`, Object.keys(value));
      console.log(`    ⚠️ Object prototype:`, Object.getPrototypeOf(value));
    }
  });
  
  // Test JSON serialization
  try {
    const jsonString = JSON.stringify(formData);
    console.log('✅ Form data JSON serialization successful');
    console.log('📄 JSON string:', jsonString);
    return true;
  } catch (error) {
    console.error('❌ Form data JSON serialization failed:', error);
    return false;
  }
};

console.log('🧪 Task testing utilities loaded!');
console.log('Available functions:');
console.log('- window.testBackendConnectivity() // Test backend JSON response format');
console.log('- window.testMinimalTaskCreation() // Test with simple data only');
console.log('- window.testTaskCreation(projectId)');
console.log('- window.checkTaskAuth()');
console.log('- window.testFetchTasks(projectId)');
console.log('- window.testTaskAPI()');
console.log('- window.runTaskSystemTest(projectId)');
console.log('- window.testFormDataSerialization(data)');
console.log('\nExample usage for debugging JSON error:');
console.log('  window.testBackendConnectivity() // Start with this to check backend response');
console.log('  window.testMinimalTaskCreation() // Then test with simple data');
console.log('\nOther functions:');
console.log('  window.runTaskSystemTest(1) // Run complete test for project ID 1');
console.log('  window.testTaskCreation(1)   // Create a test task for project ID 1');
