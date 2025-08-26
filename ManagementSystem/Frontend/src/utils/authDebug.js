// Authentication debugging utilities
import { getAuthToken, setAuthToken, isAuthenticated, getAuthHeaders } from '../config/dataSource';

export const authDebugUtils = {
  // Check current authentication status
  checkAuthStatus: () => {
    console.log('🔍 Authentication Debug Information:');
    console.log('   Token exists:', isAuthenticated());
    console.log('   Token value:', getAuthToken());
    console.log('   Headers that will be sent:', getAuthHeaders());
    
    return {
      hasToken: isAuthenticated(),
      token: getAuthToken(),
      headers: getAuthHeaders()
    };
  },

  // Set a mock token for testing (when backend requires authentication)
  setTestToken: (token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTYzNzI1NjAwMCwiZXhwIjoxNjM3MzQyNDAwfQ.test-signature') => {
    setAuthToken(token);
    console.log('🧪 Test token set:', token);
    
    // Verify the token was set correctly
    const headers = getAuthHeaders();
    console.log('✅ Headers after setting token:', headers);
    console.log('✅ Authorization header:', headers.Authorization);
    
    return authDebugUtils.checkAuthStatus();
  },

  // Clear token
  clearToken: () => {
    setAuthToken(null);
    console.log('🗑️ Token cleared');
    return authDebugUtils.checkAuthStatus();
  },

  // Test header generation manually
  testHeaderGeneration: () => {
    console.log('🔍 Testing header generation step by step:');
    
    const token = getAuthToken();
    console.log('1. Raw token from localStorage:', token);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    console.log('2. Base headers:', headers);
    
    if (token) {
      const authKey = 'Authorization';  // Should be 'Authorization'
      const authValue = `Bearer ${token}`;  // Should be 'Bearer {token}'
      headers[authKey] = authValue;
      console.log('3. Added authorization - Key:', authKey, 'Value:', authValue);
    } else {
      console.log('3. No token found, authorization header not added');
    }
    
    console.log('4. Final headers:', headers);
    
    // Compare with getAuthHeaders() function
    const officialHeaders = getAuthHeaders();
    console.log('5. Headers from getAuthHeaders():', officialHeaders);
    
    return {
      manualHeaders: headers,
      officialHeaders: officialHeaders,
      tokenExists: !!token
    };
  },

  // Comprehensive multiple tags test
  testMultipleTagsEndToEnd: async () => {
    console.log('🧪 COMPREHENSIVE MULTIPLE TAGS TEST');
    console.log('=' .repeat(50));
    
    const testCases = [
      {
        name: "Single Tag Test",
        tags: ["frontend"],
        expectedCount: 1
      },
      {
        name: "Multiple Tags Test (3 tags)",
        tags: ["frontend", "backend", "fullstack"],
        expectedCount: 3
      },
      {
        name: "Many Tags Test (5 tags)",
        tags: ["frontend", "backend", "mobile", "devops", "design"],
        expectedCount: 5
      }
    ];
    
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n🧪 Test ${i + 1}: ${testCase.name}`);
      console.log('Tags to send:', testCase.tags);
      console.log('Expected count:', testCase.expectedCount);
      
      const testProjectData = {
        name: `${testCase.name} - ${Date.now()}`,
        description: `Testing ${testCase.expectedCount} tags: ${testCase.tags.join(', ')}`,
        category: "Web Development",
        tags: testCase.tags, // ✅ Array of strings for backend List<String>
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "ACTIVE"
      };
      
      try {
        console.log('📡 Sending:', JSON.stringify(testProjectData.tags));
        
        const { getApiUrl, getAuthHeaders } = await import('../config/dataSource');
        const response = await fetch(getApiUrl('/api/project'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(testProjectData),
        });
        
        if (response.ok) {
          const result = await response.json();
          const success = result.tags && 
                         Array.isArray(result.tags) && 
                         result.tags.length === testCase.expectedCount &&
                         testCase.tags.every(tag => result.tags.includes(tag));
          
          console.log(success ? '✅ PASSED' : '❌ FAILED');
          console.log('📊 Result:', {
            sent: testCase.tags,
            received: result.tags,
            match: success
          });
          
          results.push({
            testName: testCase.name,
            success: success,
            sentTags: testCase.tags,
            receivedTags: result.tags,
            projectId: result.id
          });
        } else {
          console.log('❌ FAILED - HTTP Error:', response.status);
          results.push({
            testName: testCase.name,
            success: false,
            error: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        console.log('❌ FAILED - Error:', error.message);
        results.push({
          testName: testCase.name,
          success: false,
          error: error.message
        });
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 FINAL TEST RESULTS:');
    console.log('=' .repeat(50));
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.testName}: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
      if (result.success) {
        console.log(`   Tags: ${result.sentTags.join(', ')} → ${result.receivedTags.join(', ')}`);
      } else {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    const passedTests = results.filter(r => r.success).length;
    console.log(`\n🏆 SUMMARY: ${passedTests}/${results.length} tests passed`);
    
    if (passedTests === results.length) {
      console.log('🎉 ALL TESTS PASSED! Multiple tags are working correctly with backend List<String>!');
    } else {
      console.log('⚠️ Some tests failed. Check the logs above for details.');
    }
    
    return results;
  },

  // Test project creation with multiple tags
  testProjectCreationWithMultipleTags: async () => {
    console.log('🧪 Testing project creation with MULTIPLE tags...');
    
    const testProjectData = {
      name: "Multi-Tag Test Project",
      description: "A comprehensive test project with multiple technology tags to verify backend List<String> handling",
      category: "Web Development", 
      tags: ["frontend", "backend", "fullstack", "mobile", "devops"], // Multiple tags array
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "ACTIVE"
    };
    
    console.log('🏷️ Test project with MULTIPLE tags:', testProjectData);
    console.log('🏷️ Tags array:', testProjectData.tags);
    console.log('🏷️ Number of tags:', testProjectData.tags.length);
    console.log('🏷️ Tags JSON string:', JSON.stringify(testProjectData.tags));
    console.log('🏷️ Backend expects: List<String> in @ElementCollection field');
    
    try {
      const { getApiUrl, getAuthHeaders } = await import('../config/dataSource');
      const url = getApiUrl('/api/project');
      
      console.log('📡 Making multi-tag test request to:', url);
      console.log('📡 Headers:', getAuthHeaders());
      console.log('📡 Body with multiple tags:', JSON.stringify(testProjectData));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testProjectData),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Multi-tag project created successfully:', result);
        console.log('✅ Returned tags from backend:', result.tags);
        console.log('✅ Backend stored tags count:', result.tags?.length || 0);
        
        // Verify all tags were saved
        const originalTags = testProjectData.tags;
        const savedTags = result.tags || [];
        const allTagsSaved = originalTags.every(tag => savedTags.includes(tag));
        
        console.log('🔍 Tags verification:');
        console.log('   Original tags:', originalTags);
        console.log('   Saved tags:', savedTags);
        console.log('   All tags saved correctly:', allTagsSaved ? '✅ YES' : '❌ NO');
        
        return { success: true, project: result, tagsVerified: allTagsSaved };
      } else {
        const errorText = await response.text();
        console.log('❌ Multi-tag project creation failed:', errorText);
        return { success: false, error: errorText, status: response.status };
      }
    } catch (error) {
      console.log('❌ Network error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test project creation with specific tags
  testProjectCreationWithTags: async () => {
    console.log('🧪 Testing project creation with tags...');
    
    const testProjectData = {
      name: "Test Project with Tags",
      description: "A test project to verify tags are working correctly",
      category: "Web Development", 
      tags: ["frontend", "backend", "fullstack"], // Simple string array
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "ACTIVE"
    };
    
    console.log('🏷️ Test project data:', testProjectData);
    console.log('🏷️ Tags specifically:', testProjectData.tags);
    console.log('🏷️ Tags JSON:', JSON.stringify(testProjectData.tags));
    
    try {
      const { getApiUrl, getAuthHeaders } = await import('../config/dataSource');
      const url = getApiUrl('/api/project');
      
      console.log('📡 Making test request to:', url);
      console.log('📡 Headers:', getAuthHeaders());
      console.log('📡 Body:', JSON.stringify(testProjectData));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testProjectData),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Project created successfully:', result);
        console.log('✅ Returned tags:', result.tags);
        return { success: true, project: result };
      } else {
        const errorText = await response.text();
        console.log('❌ Project creation failed:', errorText);
        return { success: false, error: errorText, status: response.status };
      }
    } catch (error) {
      console.log('❌ Network error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test API call with current authentication
  testApiCall: async () => {
    const { getApiUrl } = await import('../config/dataSource');
    const url = getApiUrl('/api/project');
    
    console.log('🧪 Testing API call with current auth...');
    console.log('URL:', url);
    
    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API call successful:', data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.log('❌ API call failed:', errorText);
        return { success: false, status: response.status, error: errorText };
      }
    } catch (error) {
      console.log('❌ Network error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Make it available globally for browser console debugging
if (typeof window !== 'undefined') {
  window.authDebug = authDebugUtils;
  console.log('🔧 Auth debug utilities available as window.authDebug');
  console.log('   Usage:');
  console.log('   - window.authDebug.checkAuthStatus()');
  console.log('   - window.authDebug.setTestToken()');
  console.log('   - window.authDebug.testHeaderGeneration()');
  console.log('   - window.authDebug.testProjectCreationWithTags()');
  console.log('   - window.authDebug.testProjectCreationWithMultipleTags()');
  console.log('   - window.authDebug.testMultipleTagsEndToEnd() // ⭐ COMPREHENSIVE TEST');
  console.log('   - window.authDebug.clearToken()');
  console.log('   - window.authDebug.testApiCall()');
}

export default authDebugUtils;
