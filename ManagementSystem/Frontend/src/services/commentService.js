import { shouldUseMockData, isAuthenticated } from '../config/dataSource';
import authUtils from '../utils/authUtils';

// Mock data for development
const mockComments = [
  {
    id: 1,
    content: "This task looks good, but we might need to add more validation.",
    createdDateTime: "2024-01-15T10:30:00",
    user: {
      id: 1,
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      username: "john.doe"
    },
    issue: { id: 1 }
  },
  {
    id: 2,
    content: "I've completed the initial implementation. Please review.",
    createdDateTime: "2024-01-15T14:45:00",
    user: {
      id: 2,
      fullName: "Jane Smith",
      firstName: "Jane",
      lastName: "Smith",
      username: "jane.smith"
    },
    issue: { id: 1 }
  },
  {
    id: 3,
    content: "Can we schedule a meeting to discuss the requirements?",
    createdDateTime: "2024-01-16T09:15:00",
    user: {
      id: 3,
      fullName: "Mike Johnson",
      firstName: "Mike",
      lastName: "Johnson",
      username: "mike.johnson"
    },
    issue: { id: 2 }
  }
];

const commentService = {
  // Get comments by issue/task ID
  getCommentsByIssueId: async (issueId) => {
    if (shouldUseMockData()) {
      console.log('📝 Getting comments from mock data for issue:', issueId);
      return mockComments.filter(comment => comment.issue.id === parseInt(issueId));
    }

    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }

    try {
      const token = authUtils.getToken();
      const response = await fetch(`/api/comments/${issueId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          authUtils.logout();
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const comments = await response.json();
      console.log('📝 Comments fetched from server:', comments);
      return comments;
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      throw error;
    }
  },

  // Create a new comment
  createComment: async (issueId, commentContent) => {
    if (shouldUseMockData()) {
      console.log('📝 Creating comment in mock data for issue:', issueId);
      const newComment = {
        id: mockComments.length + 1,
        content: commentContent,
        createdDateTime: new Date().toISOString(),
        user: {
          id: 1,
          fullName: "Current User",
          firstName: "Current",
          lastName: "User",
          username: "current.user"
        },
        issue: { id: parseInt(issueId) }
      };
      mockComments.push(newComment);
      return newComment;
    }

    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }

    try {
      const token = authUtils.getToken();
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId: parseInt(issueId),
          commentContent: commentContent
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          authUtils.logout();
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to create comment: ${response.status}`);
      }

      const newComment = await response.json();
      console.log('📝 Comment created on server:', newComment);
      return newComment;
    } catch (error) {
      console.error('❌ Error creating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    if (shouldUseMockData()) {
      console.log('📝 Deleting comment from mock data:', commentId);
      const index = mockComments.findIndex(comment => comment.id === parseInt(commentId));
      if (index !== -1) {
        mockComments.splice(index, 1);
        return { message: 'Comment deleted successfully' };
      } else {
        throw new Error('Comment not found');
      }
    }

    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }

    try {
      const token = authUtils.getToken();
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          authUtils.logout();
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to delete comment: ${response.status}`);
      }

      const result = await response.json();
      console.log('📝 Comment deleted from server:', result);
      return result;
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService;
