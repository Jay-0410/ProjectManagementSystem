import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CalendarIcon, 
  PersonIcon, 
  DotsVerticalIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { issueService } from '@/services/issueService';
import projectService from '@/services/projectService';
import commentService from '@/services/commentService';
import CreateTaskForm from '../NewTask/CreateTaskForm';
import { toast } from 'react-hot-toast';

const ShowTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load comments for the task
  const loadComments = async () => {
    try {
      console.log(`🔄 Loading comments for task: ${taskId}`);
      const commentsData = await commentService.getCommentsByIssueId(taskId);
      setComments(commentsData);
      console.log('📝 Comments loaded:', commentsData);
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      console.log(`📝 Submitting comment for task: ${taskId}`);
      const createdComment = await commentService.createComment(taskId, newComment.trim());
      
      // Add the new comment to the list
      setComments(prevComments => [...prevComments, createdComment]);
      setNewComment('');
      toast.success('Comment added successfully');
      console.log('✅ Comment submitted:', createdComment);
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      console.log(`🗑️ Deleting comment: ${commentId}`);
      await commentService.deleteComment(commentId);
      
      // Remove the comment from the list
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully');
      console.log('✅ Comment deleted');
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Fetch task details and project details from backend
  useEffect(() => {
    const fetchTaskAndProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching task details for taskId: ${taskId}, projectId: ${projectId}`);
        
        // Fetch task details
        const [taskData, projectData] = await Promise.all([
          issueService.getTaskById(taskId),
          projectService.getProjectById(projectId)
        ]);
        
        if (taskData) {
          console.log('Task data received:', taskData);
          setTask(taskData);
        } else {
          setError('Task not found');
          toast.error('Task not found');
        }

        if (projectData) {
          console.log('Project data received:', projectData);
          setProject(projectData);
        } else {
          console.warn('Project data not found, task might still have project info');
        }

        // Load comments after task is loaded
        await loadComments();
      } catch (err) {
        console.error('Error fetching task/project details:', err);
        setError(err.message || 'Failed to fetch task details');
        toast.error(err.message || 'Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndProject();
  }, [taskId, projectId]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      console.log('Updating task status to:', newStatus);
      
      const updatedTask = await issueService.updateIssueStatus(task.id, newStatus);
      
      if (updatedTask) {
        setTask(updatedTask);
        toast.success(`Task status updated to ${newStatus.toLowerCase().replace('_', ' ')}`);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error(err.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        console.log('Deleting task:', task.id);
        
        await issueService.deleteIssue(task.id);
        
        toast.success('Task deleted successfully');
        navigate(`/project/${projectId}`);
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error(err.message || 'Failed to delete task');
      }
    }
  };

  const handleEditTask = () => {
    console.log('✏️ Edit task clicked for:', task.title);
    setIsEditDialogOpen(true);
  };

  const handleTaskUpdated = async (updatedTask) => {
    console.log('✅ Task updated successfully:', updatedTask);
    setIsEditDialogOpen(false);
    
    // Update the task state with the new data
    setTask(updatedTask);
    // Toast message is already shown by CreateTaskForm, no need to duplicate
  };

  const handleGoBack = () => {
    navigate(`/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading task details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">{error}</div>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg">Task not found</div>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleGoBack} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task?.title || 'Task Details'}</h1>
            <p className="text-sm text-gray-500">
              {task?.project?.name || 'Project'} • Task #{task?.id || taskId}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <DotsVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('TODO')}>
              Mark as To Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('DONE')}>
              Mark as Done
            </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEditTask}>Edit Task</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleDeleteTask}
            >
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{task?.description || 'No description provided'}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment?.user?.fullName?.charAt(0) || comment?.user?.firstName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment?.user?.fullName || `${comment?.user?.firstName || ''} ${comment?.user?.lastName || ''}`.trim() || 'Unknown User'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment?.createdDateTime ? new Date(comment.createdDateTime).toLocaleDateString() : 'Unknown date'}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <DotsVerticalIcon className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600"
                                >
                                  Delete Comment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm text-gray-700">{comment?.content || 'No content'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t">
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmittingComment}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isSubmittingComment || !newComment.trim()}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Status
                </label>
                <Badge className={getStatusColor(task?.status)}>
                  {task?.status?.replace('_', ' ') || 'Unknown'}
                </Badge>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Priority
                </label>
                <Badge className={getPriorityColor(task?.priority)}>
                  {task?.priority || 'Not Set'}
                </Badge>
              </div>

              {/* Assignee */}
              {task?.assignee && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {task.assignee.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{task.assignee.name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">@{task.assignee.username || 'unknown'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Due Date */}
              {task?.dueDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task?.tags && task.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Project Name
                </label>
                <div className="font-medium">{project?.name || task?.project?.name || 'Unknown Project'}</div>
              </div>

              {/* Project Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <div className="text-sm text-gray-600">
                  {project?.description || task?.project?.description || 'No description available'}
                </div>
              </div>

              {/* Project Status */}
              {(project?.status || task?.project?.status) && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Status
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {project?.status || task?.project?.status}
                  </Badge>
                </div>
              )}

              {/* Project Owner */}
              {(project?.owner || task?.project?.owner) && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Project Owner
                  </label>
                  <div className="text-sm">
                    {project?.owner?.fullName || task?.project?.owner?.fullName || 'Unknown Owner'}
                  </div>
                </div>
              )}

              {/* Creation Date */}
              {(project?.createdAt || task?.project?.createdAt) && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Created On
                  </label>
                  <div className="text-sm text-gray-600">
                    {new Date(project?.createdAt || task?.project?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Team Size */}
              {(project?.team || task?.project?.team) && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Team Size
                  </label>
                  <div className="text-sm text-gray-600">
                    {(project?.team?.length || task?.project?.team?.length || 0)} members
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CreateTaskForm 
          taskToEdit={task}
          onTaskUpdated={handleTaskUpdated}
          project={project}
        />
      </Dialog>
    </div>
  );
};

export default ShowTask;