import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, CalendarIcon, PersonIcon, TrashIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import issueService from "../../../../services/issueService";
import CreateTaskForm from "../NewTask/CreateTaskForm";
import { toast } from "react-hot-toast";

const TaskGroup = ({ type, tasks, project, onTaskUpdate }) => {
  const navigate = useNavigate();
  const [updatingTasks, setUpdatingTasks] = useState(new Set());
  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Delete confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Dropdown state management
  const [openDropdown, setOpenDropdown] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'done': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': 
      case 'todo': 
      case 'to_do': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  // Handle task status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setUpdatingTasks(prev => new Set(prev).add(taskId));
      setOpenDropdown(null); // Close dropdown
      console.log('🔄 Updating task status:', { taskId, newStatus });
      
      await issueService.updateIssueStatus(taskId, newStatus);
      toast.success(`Task moved to ${newStatus.replace('_', ' ').toLowerCase()}`);
      
      // Notify parent component to refresh
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      toast.error('Failed to update task status: ' + error.message);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Handle task deletion
  const handleTaskDelete = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
    setOpenDropdown(null); // Close dropdown
  };

  // Confirm and execute task deletion
  const confirmTaskDelete = async () => {
    if (!taskToDelete) return;

    try {
      setUpdatingTasks(prev => new Set(prev).add(taskToDelete));
      console.log('🗑️ Deleting task:', taskToDelete);
      
      await issueService.deleteIssue(taskToDelete);
      toast.success('Task deleted successfully');
      
      // Notify parent component to refresh
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast.error('Failed to delete task: ' + error.message);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskToDelete);
        return newSet;
      });
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  // Cancel task deletion
  const cancelTaskDelete = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  // Handle task edit
  const handleTaskEdit = (task) => {
    console.log('✏️ Edit task clicked for:', task.title);
    setEditingTask(task);
    setIsEditDialogOpen(true);
    setOpenDropdown(null); // Close dropdown
  };

  // Handle task updated
  const handleTaskUpdated = (updatedTask) => {
    console.log('✅ Task updated successfully:', updatedTask);
    setIsEditDialogOpen(false);
    setEditingTask(null);
    
    // Notify parent component to refresh
    if (onTaskUpdate) {
      onTaskUpdate();
    }
    
    toast.success('Task updated successfully');
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No {type} tasks yet</p>
        <p className="text-sm text-gray-400">Tasks will appear here when created</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 md:p-6">
      {tasks.map((task, index) => {
        const projectId = project?.projectId || project?.id || task.projectId;
        const taskId = task.issueId || task.id;
        const assigneeName = task.assignee?.fullName || 
                            task.assignee?.firstName || 
                            task.assignedTo || 
                            'Unassigned';
        const isUpdating = updatingTasks.has(taskId);
        
        return (
          <Card
            key={taskId || index}
            className={`group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden h-fit min-h-[280px] max-w-full w-full ${isUpdating ? 'opacity-50' : ''}`}
            onClick={() => navigate(`/project/${projectId}/task/${taskId}`)}
          >
            {/* Loading indicator */}
            {isUpdating && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(task.status)}`}></div>
            
            {/* Actions dropdown - positioned absolutely */}
            <div className="absolute top-3 right-3 z-20">
              <DropdownMenu 
                open={openDropdown === taskId} 
                onOpenChange={(open) => setOpenDropdown(open ? taskId : null)}
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuTrigger 
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-all duration-200 opacity-60 hover:opacity-100 focus:opacity-100 bg-white/80 hover:bg-white shadow-sm"
                  disabled={isUpdating}
                >
                  <DotsVerticalIcon className="h-4 w-4 text-gray-600 hover:text-gray-800" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskEdit(task);
                    }}
                  >
                    Edit Task
                  </DropdownMenuItem>
                  
                  {task.status !== 'IN_PROGRESS' && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(taskId, 'IN_PROGRESS');
                      }}
                    >
                      Move to In Progress
                    </DropdownMenuItem>
                  )}
                  
                  {task.status !== 'COMPLETED' && task.status !== 'DONE' && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(taskId, 'COMPLETED');
                      }}
                    >
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                  
                  {(task.status === 'COMPLETED' || task.status === 'DONE') && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(taskId, 'TO_DO');
                      }}
                    >
                      Move to To Do
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskDelete(taskId);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <CardHeader className="pb-2 px-4 pt-4 pr-12">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight break-words">
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="text-sm text-gray-500 line-clamp-2 leading-relaxed break-words">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3 px-4 pb-4">
              {/* Priority and Due Date */}
              <div className="flex items-center justify-between gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium px-2 py-1 flex-shrink-0 ${getPriorityColor(task.priority)}`}
                >
                  {task.priority || 'Medium'}
                </Badge>
                
                {task.dueDate && (
                  <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span className="truncate">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div className="flex items-center space-x-2 min-w-0">
                <Avatar className="h-7 w-7 border-2 border-white shadow-sm flex-shrink-0">
                  <AvatarImage 
                    src={task.assignee?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName)}&background=random`} 
                    alt={assigneeName} 
                  />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {assigneeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {assigneeName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <PersonIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Assignee</span>
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              {task.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <CreateTaskForm 
            taskToEdit={editingTask}
            onTaskUpdated={handleTaskUpdated}
            project={project}
          />
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              Delete Task
            </DialogTitle>
            <DialogDescription className="text-gray-600 leading-relaxed">
              Are you sure you want to delete this task? This action cannot be undone and will permanently remove the task from your project.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={cancelTaskDelete}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmTaskDelete}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-colors duration-200"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskGroup;
