import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const TaskGroup = ({ type, tasks }) => {
  const navigate = useNavigate();

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
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {tasks.map((task, index) => {
        return (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden"
            onClick={() => navigate(`/project/${task.projectId}/task/${task.id}`)}
          >
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(task.status)}`}></div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </CardDescription>
                </div>
                
                {/* Actions dropdown */}
                <DropdownMenu onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <DotsVerticalIcon className="h-4 w-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Move to In Progress</DropdownMenuItem>
                    <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Priority and Due Date */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
                >
                  {task.priority || 'Medium'} Priority
                </Badge>
                
                {task.dueDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {task.assignedTo?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.assignedTo || 'Unassigned'}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <PersonIcon className="h-3 w-3 mr-1" />
                    Assignee
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
    </div>
  );
};

export default TaskGroup;
