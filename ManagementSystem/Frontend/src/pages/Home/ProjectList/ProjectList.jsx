import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard/ProjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import projectService from '../../../services/projectService';
import { shouldUseMockData } from '../../../config/dataSource';
import { calculateProjectStats } from '../../../utils/projectStats';
import { toast } from 'sonner';
import { TrendingUp, Activity, CheckCircle, Clock, Search, Filter, AlertTriangle, Calendar } from 'lucide-react';

const ProjectList = ({ filters, viewMode = 'grid' }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Apply frontend filtering whenever filters or projects change
  useEffect(() => {
    applyFilters();
  }, [filters, projects]);

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
      
      // This will automatically use mock data or server data based on configuration
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
      
      console.log(`📊 Data loaded from: ${shouldUseMockData() ? 'Mock Data' : 'Server API'}`);
    } catch (error) {
      console.error('Error loading projects:', error);
      
      // Enhanced error handling
      if (!shouldUseMockData()) {
        console.warn('🔄 Server request failed, falling back to mock data...');
        try {
          // Fallback to mock data if server fails
          const mockProjectsData = await projectService.getAllProjects();
          setProjects(mockProjectsData);
        } catch (mockError) {
          console.error('Even mock data failed:', mockError);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Frontend filtering logic
  const applyFilters = () => {
    let filtered = [...projects];

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(project => 
        project.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags !== 'all') {
      filtered = filtered.filter(project => 
        project.tags?.some(tag => 
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      );
    }

    // Apply search keyword filter
    if (filters.searchKeyword && filters.searchKeyword.trim()) {
      const keyword = filters.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(keyword) ||
        project.description?.toLowerCase().includes(keyword) ||
        project.category?.toLowerCase().includes(keyword) ||
        project.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    setFilteredProjects(filtered);
    console.log(`🔍 Applied filters:`, filters);
    console.log(`📊 Filtered projects: ${filtered.length}/${projects.length}`);
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );
    
    if (!confirmDelete) return false; // Return false to indicate no action taken

    try {
      console.log('🗑️ Deleting project with ID:', projectId);
      await projectService.deleteProject(projectId);
      
      // Remove the project from both arrays
      const updatedProjects = projects.filter(project => 
        (project.id || project.projectId) !== projectId
      );
      const updatedFilteredProjects = filteredProjects.filter(project => 
        (project.id || project.projectId) !== projectId
      );
      
      setProjects(updatedProjects);
      setFilteredProjects(updatedFilteredProjects);
      
      console.log('✅ Project deleted successfully, staying on current page');
      toast.success('Project deleted successfully');
      
      // Explicitly prevent any navigation that might be triggered
      return false; // Indicate that no navigation should occur
      
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      toast.error('Failed to delete project: ' + error.message);
      return false; // Ensure no navigation on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-600">Loading projects...</p>
            <p className="text-sm text-gray-400">Fetching your latest data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Projects</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.total || 0}</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <Activity className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active</p>
                <p className="text-2xl font-bold text-green-900">{stats?.active || 0}</p>
                {stats?.overdue > 0 && (
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {stats.overdue} overdue
                  </p>
                )}
              </div>
              <div className="p-2 bg-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Completed</p>
                <p className="text-2xl font-bold text-purple-900">{stats?.completed || 0}</p>
                {stats?.total > 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    {Math.round((stats.completed / stats.total) * 100)}% completion rate
                  </p>
                )}
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg Progress</p>
                <p className="text-2xl font-bold text-orange-900">{stats?.averageProgress || 0}%</p>
                {stats?.dueThisWeek > 0 && (
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {stats.dueThisWeek} due this week
                  </p>
                )}
              </div>
              <div className="p-2 bg-orange-200 rounded-lg">
                <Clock className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProjects.length === projects.length ? 'All Projects' : 'Filtered Results'}
          </h2>
          {filteredProjects.length !== projects.length && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filteredProjects.length} of {projects.length}
            </Badge>
          )}
        </div>
        
        {/* Active Filters Chips */}
        {(filters.category !== 'all' || filters.tags !== 'all' || filters.searchKeyword) && (
          <div className="flex items-center gap-2">
            {filters.category !== 'all' && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                📁 {filters.category}
              </Badge>
            )}
            {filters.tags !== 'all' && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                🏷️ {filters.tags}
              </Badge>
            )}
            {filters.searchKeyword && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                🔍 "{filters.searchKeyword}"
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length > 0 ? (
        <div className={`transition-all duration-300 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredProjects.map((project, index) => (
            <div 
              key={project.projectId}
              className="animate-in slide-in-from-bottom duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard 
                project={project}
                onDelete={handleDeleteProject}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="p-4 bg-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                {(filters.category !== 'all' || filters.tags !== 'all' || filters.searchKeyword) ? (
                  <Search className="h-8 w-8 text-gray-500" />
                ) : (
                  <Activity className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {projects.length === 0 
                    ? 'Start by creating your first project to get organized.' 
                    : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectList;
