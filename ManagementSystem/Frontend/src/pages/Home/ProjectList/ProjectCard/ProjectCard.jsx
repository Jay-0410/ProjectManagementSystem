import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  MoreVertical, 
  Users, 
  Calendar,
  TrendingUp,
  Edit3,
  Trash2,
  Eye,
  Star,
  GitBranch,
  Activity,
  Clock
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProjectForm from "../../../Navbar/NewProject/CreateProjectForm";

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
    status: "ACTIVE"
  },
  onDelete,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Calculate project statistics
  const totalTasks = project.issues?.length || 0;
  const completedTasks = project.issues?.filter(issue => issue.status === "COMPLETED")?.length || 0;
  const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Use provided completion percentage or calculate from tasks
  const progressPercentage = project.completionPercentage ?? calculatedProgress;
  
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

  const handleCardClick = (e) => {
    // Prevent navigation when deleting, editing, or clicking on dropdown/interactive elements
    if (isDeleting || 
        isEditDialogOpen ||
        e.target.closest('.dropdown-trigger') || 
        e.target.closest('[role="menuitem"]') ||
        e.target.closest('.dropdown-content')) {
      console.log('🚫 Card click prevented - deleting, editing, or dropdown interaction');
      return;
    }
    navigate(`/project/${project.id || project.projectId}`);
  };

  const handleEditClick = (e) => {
    // Prevent event bubbling to card click
    e.stopPropagation();
    e.preventDefault();
    
    console.log('✏️ Edit clicked for project:', project.id || project.projectId);
    setIsEditDialogOpen(true);
  };

  const handleProjectUpdated = () => {
    console.log('✅ Project updated successfully');
    setIsEditDialogOpen(false);
    // Optionally trigger a refresh of the project list
    if (onFilterByCategory || onSearch) {
      // This could trigger a parent component refresh
      window.location.reload(); // Simple refresh for now
    }
  };

  const handleDeleteClick = async (e) => {
    // Prevent event bubbling to card click
    e.stopPropagation();
    e.preventDefault();
    
    console.log('🗑️ Delete clicked for project:', project.id || project.projectId);
    setIsDeleting(true);
    
    if (onDelete) {
      try {
        const result = await onDelete(project.id || project.projectId);
        // If delete handler returns false, it means we should not navigate
        if (result === false) {
          console.log('✅ Delete completed, staying on current page');
        }
      } catch (error) {
        console.error('❌ Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card 
        onClick={handleCardClick}
        className="group w-full max-w-[400px] min-h-[320px] flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-sm cursor-pointer relative overflow-hidden hover:scale-[1.02]"
      >
      {/* Header with gradient background and title */}
      <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white line-clamp-1 mb-1">
              {project.name || project.projectName}
            </h3>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-white/90" />
              <span className="text-sm text-white/90 capitalize">
                {project.status?.toLowerCase().replace('_', ' ') || 'active'}
              </span>
            </div>
          </div>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="dropdown-trigger p-2 rounded-lg hover:bg-white/20 transition-colors opacity-70 hover:opacity-100 focus:opacity-100">
              <MoreVertical className="h-4 w-4 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 dropdown-content">
              <DropdownMenuItem onClick={() => navigate(`/project/${project.id || project.projectId}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditClick}>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Category badge */}
        <div className="mt-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            {project.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 space-y-4 pt-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

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
              <TrendingUp className="h-3 w-3" />
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
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600">Team</span>
          </div>
          <div className="flex -space-x-2">
            {project.team?.slice(0, 4).map((member, index) => {
              const memberName = member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim();
              const initials = memberName ? memberName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
              return (
                <Avatar key={member.id || member.userId || index} className="h-7 w-7 border-2 border-white shadow-sm">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {project.team?.length > 4 && (
              <div className="h-7 w-7 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs font-medium text-gray-600">
                  +{project.team.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>
              Owner: {
                project.owner?.fullName?.split(' ')[0] || 
                project.owner?.firstName || 
                'Unknown'
              }
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>

    {/* Edit Project Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
        <DialogTitle className="text-lg font-semibold px-6 py-4 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm">
          Edit Project
        </DialogTitle>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <CreateProjectForm 
            projectToEdit={project}
            onProjectUpdated={handleProjectUpdated}
          />
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ProjectCard;
