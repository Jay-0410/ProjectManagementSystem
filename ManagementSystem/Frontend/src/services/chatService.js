import { USE_MOCK_DATA, getApiUrl, getAuthHeaders } from "../config/dataSource";

const API_BASE_URL = "http://localhost:8080";

// Mock chat data
const MOCK_MESSAGES = [
  {
    id: 1,
    content: "Hello team! How is everyone doing with the project?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    sender: {
      id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com"
    }
  },
  {
    id: 2,
    content: "Hi Jane! I'm making good progress on the frontend components. Should have the dashboard ready by tomorrow.",
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
    sender: {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com"
    }
  },
  {
    id: 3,
    content: "Great work John! I've finished the API endpoints for user management. Let me know if you need any backend changes.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    sender: {
      id: 3,
      fullName: "Mike Johnson",
      email: "mike.johnson@example.com"
    }
  },
  {
    id: 4,
    content: "Thanks Mike! That's perfect timing. I'll start integrating the user management features today.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    sender: {
      id: 1,
      fullName: "John Doe", 
      email: "john.doe@example.com"
    }
  }
];

// Send a new message
// Note: Backend expects a token field instead of senderId for user identification
export const sendMessage = async (messageData) => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data for sending message:', messageData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock response
    const mockMessage = {
      id: Date.now(),
      content: messageData.content,
      createdAt: new Date().toISOString(),
      sender: {
        id: 1, // Mock current user ID
        fullName: "Current User",
        email: "current.user@example.com"
      }
    };
    
    console.log('Mock message sent:', mockMessage);
    return mockMessage;
  }

  try {
    console.log('Sending message:', messageData);
    
    const response = await fetch(getApiUrl('/api/messages/send'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Response status:', response.status);
      console.error('Response data:', errorData);
      throw new Error(`Failed to send message: ${response.status} ${errorData}`);
    }
    
    const result = await response.json();
    console.log('Message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Get messages for a specific project
export const getMessagesByProjectId = async (projectId) => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data for project messages:', projectId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For mock data, return empty array for some projects to simulate no messages
    if (projectId > 3) {
      console.log('Mock: No messages for project', projectId);
      return [];
    }
    
    console.log('Mock messages fetched:', MOCK_MESSAGES);
    return MOCK_MESSAGES;
  }

  try {
    console.log('Fetching messages for project:', projectId);
    
    const response = await fetch(getApiUrl(`/api/messages/chat/${projectId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    console.log('Response status:', response.status);
    
    // Handle 404 as "no messages found" rather than an error
    if (response.status === 404) {
      console.log('No messages found for project (404):', projectId);
      return [];
    }
    
    // Handle other 4xx and 5xx errors that might indicate "no messages"
    if (response.status === 400 || response.status === 204) {
      console.log('No content/bad request - treating as no messages:', response.status);
      return [];
    }
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Response status:', response.status);
      console.error('Response data:', errorData);
      
      // Check if error message indicates no messages found
      if (errorData && (
        errorData.includes('No messages found') ||
        errorData.includes('no messages') ||
        errorData.includes('empty')
      )) {
        console.log('Backend returned "no messages" error - treating as empty array');
        return [];
      }
      
      throw new Error(`Failed to fetch messages: ${response.status} ${errorData}`);
    }
    
    const result = await response.json();
    console.log('Messages fetched successfully:', result);
    return result || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Additional check for network/server errors that might be "no messages"
    if (error.message && (
      error.message.includes('No messages') ||
      error.message.includes('404') ||
      error.message.includes('not found')
    )) {
      console.log('Treating error as no messages scenario');
      return [];
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Format message timestamp for display
export const formatMessageTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

// Format message date for display
export const formatMessageDate = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Check if message is from current user
export const isCurrentUserMessage = (message, currentUserId) => {
  return message.sender && message.sender.id === currentUserId;
};

const chatService = {
  sendMessage,
  getMessagesByProjectId,
  formatMessageTime,
  formatMessageDate,
  getUserInitials,
  isCurrentUserMessage
};

export default chatService;
