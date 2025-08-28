import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox/ChatBox";
import { Link, Outlet, Route, Routes, useLocation, useParams, useNavigate } from "react-router-dom";
import Details from "./Details/Details";
import Tasks from "./Tasks/Tasks";
import TeamMembers from "./TeamMembers/TeamMembers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import projectService from "../../services/projectService";
import { shouldUseMockData } from "../../config/dataSource";
import { toast } from 'sonner';
import CreateProjectForm from "../Navbar/NewProject/CreateProjectForm";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const [selectedTab, setSelectedTab] = useState("details");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load project data when component mounts or projectId changes
  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This will automatically use mock data or server data based on configuration
      const projectData = await projectService.getProjectById(projectId);
      if (projectData) {
        setProject(projectData);
        console.log(`📊 Project loaded from: ${shouldUseMockData() ? 'Mock Data' : 'Server API'}`);
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.projectName || project.name}"? This action cannot be undone and will delete all associated tasks, messages, and data.`
    );
    
    if (!confirmDelete) return;

    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      // Navigate back to home page after successful deletion
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project: ' + error.message);
    }
  };

  // Handle project edit
  const handleEditProject = () => {
    console.log('✏️ Edit project clicked for:', project.projectName || project.name);
    setIsEditDialogOpen(true);
  };

  // Handle project updated
  const handleProjectUpdated = async () => {
    console.log('✅ Project updated successfully');
    setIsEditDialogOpen(false);
    // Reload the project data to get the latest changes
    await loadProject();
    toast.success('Project updated successfully');
  };

  const handleClick = (e) => {
    // Handle click event
    setSelectedTab(e.target.getAttribute("name"));
    console.log("Element clicked");
  };

  if (loading) {
    return (
      <div className="h-[82vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-[82vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 text-lg">{error || 'Project not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[82vh]">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6 mb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.projectName || project.name}</h1>
              <p className="text-white/90 text-lg mb-3 max-w-2xl">{project.description}</p>
              <div className="flex items-center gap-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {project.category}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {project.status?.toLowerCase().replace('_', ' ') || 'active'}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {project.completionPercentage || 0}% Complete
                </span>
              </div>
            </div>
            
            {/* Project Actions */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <DotsVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleEditProject}>
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={handleDeleteProject}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-full h-[calc(100vh-200px)]"
      >
        <ResizablePanel defaultSize={65}>
          <div className="h-full flex flex-col p-6 overflow-hidden">
            
              <Tabs defaultValue="tasks" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="team">Team Members</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <Details project={project} />
                  </div>
                </TabsContent>
                <TabsContent value="tasks" className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <Tasks project={project} />
                  </div>
                </TabsContent>
                <TabsContent value="team" className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <TeamMembers project={project} />
                  </div>
                </TabsContent>
              </Tabs>
            
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35}>
          <div className="h-full p-6 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <ChatBox project={project} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
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
    </div>
  );
};

export default ProjectDetails;
