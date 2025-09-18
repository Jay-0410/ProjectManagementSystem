import { getApiUrl, getAuthHeaders } from "../config/dataSource";

// Send a new message
export const sendMessage = async (messageData) => {

  try {
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
      throw new Error(`Failed to send message: ${response.status} ${errorData}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Get messages for a specific project
export const getMessagesByProjectId = async (projectId) => {
  try {
    const response = await fetch(getApiUrl(`/api/messages/chat/${projectId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    // Handle 404 as "no messages found" rather than an error
    if (response.status === 404) {
      return [];
    }
    
    // Handle other 4xx and 5xx errors that might indicate "no messages"
    if (response.status === 400 || response.status === 204) {
      return [];
    }
    
    if (!response.ok) {
      const errorData = await response.text();
      
      // Check if error message indicates no messages found
      if (errorData && (
        errorData.includes('No messages found') ||
        errorData.includes('no messages') ||
        errorData.includes('empty')
      )) {
        return [];
      }
      
      throw new Error(`Failed to fetch messages: ${response.status} ${errorData}`);
    }
    
    const result = await response.json();
    return result || [];
  } catch (error) {
    // Additional check for network/server errors that might be "no messages"
    if (error.message && (
      error.message.includes('No messages') ||
      error.message.includes('404') ||
      error.message.includes('not found')
    )) {
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
    return '';
  }
};

// Format message date for display
export const formatMessageDate = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  } catch (error) {
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
