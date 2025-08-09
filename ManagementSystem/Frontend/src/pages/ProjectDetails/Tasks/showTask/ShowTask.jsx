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

const ShowTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/issues/${taskId}`);
        // const taskData = await response.json();
        
        // Mock data based on Issue entity structure
        const mockTask = {
          id: taskId,
          title: "Implement User Authentication",
          description: "Create a comprehensive user authentication system with login, register, and password reset functionality. This should include JWT token management and proper security measures.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: "2025-08-15",
          tags: ["backend", "security", "authentication", "urgent"],
          assignee: {
            id: 1,
            username: "john.doe",
            name: "John Doe",
            email: "john.doe@example.com"
          },
          project: {
            id: projectId,
            name: "Project Management System",
            description: "A comprehensive project management solution"
          },
          comments: [
            {
              id: 1,
              content: "Started working on the JWT implementation",
              createdAt: "2025-08-05T10:30:00",
              author: {
                name: "John Doe",
                username: "john.doe"
              }
            },
            {
              id: 2,
              content: "Need to review the security requirements",
              createdAt: "2025-08-06T14:15:00",
              author: {
                name: "Jane Smith",
                username: "jane.smith"
              }
            }
          ]
        };
        
        setTask(mockTask);
      } catch (err) {
        setError('Failed to fetch task details');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
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

  const handleStatusChange = (newStatus) => {
    // TODO: Implement status update API call
    console.log('Updating status to:', newStatus);
    setTask(prev => ({ ...prev, status: newStatus }));
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
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-sm text-gray-500">
              {task.project.name} • Task #{task.id}
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
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
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
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({task.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm">Post</Button>
                </div>
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
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Priority
                </label>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Assignee
                </label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {task.assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{task.assignee.name}</div>
                    <div className="text-xs text-gray-500">@{task.assignee.username}</div>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Due Date
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>

              {/* Tags */}
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
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="font-medium">{task.project.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {task.project.description}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShowTask;