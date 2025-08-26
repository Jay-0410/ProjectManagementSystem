import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { 
  CalendarIcon, 
  PersonIcon, 
  ClockIcon,
  TargetIcon,
  CheckCircledIcon
} from "@radix-ui/react-icons";

const Details = ({ project }) => {
  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No project data available</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate progress
  const totalTasks = project.issues?.length || 0;
  const completedTasks = project.issues?.filter(issue => issue.status === "COMPLETED")?.length || 0;
  const progressPercentage = project.completionPercentage ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Project Overview */}
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Owner</h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.owner?.avatar} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {project.owner?.firstName?.[0] || project.owner?.fullName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {project.owner?.fullName || `${project.owner?.firstName || ''} ${project.owner?.lastName || ''}`.trim()}
                        </p>
                        <p className="text-xs text-gray-500">{project.owner?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>Started: {formatDate(project.startDate || project.createdAt)}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span>Due: {formatDate(project.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <Badge 
                      variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}
                      className={project.status === 'COMPLETED' ? 'bg-green-500 text-white' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {project.status?.toLowerCase().replace('_', ' ') || 'active'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                  <span className="text-sm font-semibold text-gray-700">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{completedTasks} of {totalTasks} tasks completed</span>
                  <div className="flex items-center gap-1">
                    <CheckCircledIcon className="h-3 w-3" />
                    <span>Progress: {progressPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Technology Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Project Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
};

export default Details;

