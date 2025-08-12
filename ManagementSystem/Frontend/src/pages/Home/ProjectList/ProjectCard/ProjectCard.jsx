import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  DotFilledIcon, 
  DotsVerticalIcon, 
  PersonIcon, 
  CheckCircledIcon,
  ClockIcon,
  CalendarIcon
} from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ 
  project = {
    id: 1,
    name: "E-Commerce Platform",
    description: "A comprehensive online shopping platform with modern UI/UX design and advanced features",
    category: "Web Development",
    tags: ["React", "Node.js", "MongoDB", "Payment Gateway"],
    owner: { id: 1, fullName: "John Doe", email: "john@example.com" },
    team: [
      { id: 1, fullName: "John Doe", email: "john@example.com" },
      { id: 2, fullName: "Jane Smith", email: "jane@example.com" },
      { id: 3, fullName: "Mike Johnson", email: "mike@example.com" }
    ],
    issues: [
      { id: 1, status: "COMPLETED" },
      { id: 2, status: "IN_PROGRESS" },
      { id: 3, status: "PENDING" },
      { id: 4, status: "COMPLETED" },
      { id: 5, status: "IN_PROGRESS" }
    ],
    createdAt: "2024-01-15",
    status: "ACTIVE"
  }
}) => {
  const navigate = useNavigate();
  
  // Calculate project statistics
  const totalTasks = project.issues?.length || 0;
  const completedTasks = project.issues?.filter(issue => issue.status === "COMPLETED")?.length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'text-green-500';
      case 'COMPLETED': return 'text-blue-500';
      case 'ON_HOLD': return 'text-yellow-500';
      case 'CANCELLED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get progress color
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="group w-full max-w-[400px] min-h-[280px] flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-sm cursor-pointer relative overflow-hidden">
      {/* Header with gradient background */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle 
              onClick={() => navigate(`/project/${project.id}`)}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
            >
              {project.name}
            </CardTitle>
            <div className="flex items-center mt-2">
              <DotFilledIcon className={`h-4 w-4 ${getStatusColor(project.status)}`} />
              <span className="text-sm text-gray-600 capitalize">
                {project.status?.toLowerCase().replace('_', ' ') || 'active'}
              </span>
            </div>
          </div>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
              <DotsVerticalIcon className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
            {project.category}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags?.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {project.tags?.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <CheckCircledIcon className="h-3 w-3" />
              Progress
            </span>
            <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progressPercentage)}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {progressPercentage}% complete
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 space-y-3">
        {/* Team Members */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <PersonIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600">Team</span>
          </div>
          <div className="flex -space-x-2">
            {project.team?.slice(0, 4).map((member, index) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-white shadow-sm">
                <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {member.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team?.length > 4 && (
              <div className="h-7 w-7 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs font-medium text-gray-600">
                  +{project.team.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            <span>Owner: {project.owner?.fullName?.split(' ')[0] || 'Unknown'}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
