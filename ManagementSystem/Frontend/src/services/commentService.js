import { isAuthenticated } from '../config/dataSource';
import authUtils from '../utils/authUtils';

const commentService = {
  // Get comments by issue/task ID
  getCommentsByIssueId: async (issueId) => {
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

      return response.json();
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      throw error;
    }
  },

  // Create a new comment
  createComment: async (issueId, commentContent) => {
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

      return response.json();
    } catch (error) {
      console.error('❌ Error creating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
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

      return response.json();
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService;
