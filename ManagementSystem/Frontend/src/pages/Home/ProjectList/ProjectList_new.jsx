import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard/ProjectCard';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProjects, getProjectsByCategory, searchProjects, getProjectsByStatus } from '../../../utils/mockProjectData';
import { calculateProjectStats } from '../../../utils/projectStats';
import { api } from '../../../utils/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Calculate stats whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      const calculatedStats = calculateProjectStats(projects);
      setStats(calculatedStats);
    }
  }, [projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // For development, use mock data
      // In production, uncomment the API call below
      // const response = await api.getAllProjects();
      // setProjects(response);
      // setFilteredProjects(response);
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to mock data on error
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategory = (category) => {
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = getProjectsByCategory(category);
      setFilteredProjects(filtered);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = searchProjects(keyword);
      setFilteredProjects(filtered);
    }
  };

  const handleFilterByStatus = (status) => {
    if (status === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = getProjectsByStatus(status);
      setFilteredProjects(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track your project progress</p>
        </div>

        {/* Enhanced Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
            <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
            {stats?.overdue > 0 && (
              <p className="text-xs text-red-600 mt-1">{stats.overdue} overdue</p>
            )}
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Completed Projects</h3>
            <p className="text-2xl font-bold text-blue-600">{stats?.completed || 0}</p>
            {stats?.total > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {Math.round((stats.completed / stats.total) * 100)}% rate
              </p>
            )}
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Average Progress</h3>
            <p className="text-2xl font-bold text-purple-600">{stats?.averageProgress || 0}%</p>
            {stats?.dueThisWeek > 0 && (
              <p className="text-xs text-orange-600 mt-1">{stats.dueThisWeek} due this week</p>
            )}
          </Card>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.projectId} 
                project={project}
                onFilterByCategory={handleFilterByCategory}
                onSearch={handleSearch}
                onFilterByStatus={handleFilterByStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ProjectList;