import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import CreateTaskForm from "./NewTask/CreateTaskForm";
import { PlusCircledIcon, PlusIcon, CheckCircledIcon, ClockIcon, StopwatchIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskGroup from "./TaskGroup/TaskGroup";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import issueService from "../../../services/issueService";
import { toast } from "react-hot-toast";

const Tasks = ({ project }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No project data available</p>
      </div>
    );
  }

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      if (!project.id && !project.projectId) {
        console.warn('No project ID available to fetch tasks');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const projectId = project.id || project.projectId;
        console.log('🔄 Fetching tasks for project:', projectId);
        
        const fetchedTasks = await issueService.getIssuesByProject(projectId);
        console.log('✅ Tasks fetched successfully:', fetchedTasks);
        
        setTasks(fetchedTasks || []);
      } catch (err) {
        console.error('❌ Error fetching tasks:', err);
        setError(err.message);
        toast.error('Failed to load tasks: ' + err.message);
        setTasks([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project, refreshTrigger]); // Re-fetch when project changes or refresh is triggered

  // Handle task creation success
  const handleTaskCreated = (newTask) => {
    console.log('✅ New task created:', newTask);
    setDialogOpen(false); // Close the dialog
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh to reload tasks
    // Toast message is already shown in CreateTaskForm, no need to duplicate
  };

  // Handle task updates (status changes, deletions, etc.)
  const handleTaskUpdate = () => {
    console.log('🔄 Task updated, refreshing task list...');
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh to reload tasks
  };

  // Use fetched tasks or fallback to project.issues
  const currentTasks = tasks.length > 0 ? tasks : (project.issues || []);
  
  // Group tasks by status
  const todoTasks = currentTasks.filter(task => task.status === 'TODO' || task.status === 'TO_DO' || task.status === 'PENDING');
  const inProgressTasks = currentTasks.filter(task => task.status === 'IN_PROGRESS');
  const completedTasks = currentTasks.filter(task => task.status === 'COMPLETED' || task.status === 'DONE');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'DONE':
        return <CheckCircledIcon className="h-4 w-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <StopwatchIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'DONE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500">Error loading tasks: {error}</p>
          <Button 
            variant="outline" 
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Header with Task Stats */}
      <Card className="mb-4 flex-shrink-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Project Tasks</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[400px]">
                <DialogTitle className="text-lg font-semibold">
                  Create New Task
                </DialogTitle>
                <DialogDescription>
                  Add a new task to {project.projectName || project.name}
                </DialogDescription>
                <CreateTaskForm 
                  project={project} 
                  onTaskCreated={handleTaskCreated}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Task Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold text-gray-700">{todoTasks.length}</span>
              </div>
              <p className="text-sm text-gray-500">To Do</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <StopwatchIcon className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-semibold text-blue-700">{inProgressTasks.length}</span>
              </div>
              <p className="text-sm text-blue-600">In Progress</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="text-lg font-semibold text-green-700">{completedTasks.length}</span>
              </div>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Groups */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="flex-1 border-none py-0 px-2">
          {/* To Do Tasks */}
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="todo">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <span>To Do</span>
                  <Badge variant="secondary" className="ml-2">
                    {todoTasks.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TaskGroup
                  type="todo"
                  tasks={todoTasks}
                  project={project}
                  onTaskUpdate={handleTaskUpdate}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* In Progress Tasks */}
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="in-progress">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <StopwatchIcon className="h-4 w-4 text-blue-500" />
                  <span>In Progress</span>
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                    {inProgressTasks.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TaskGroup
                  type="in-progress"
                  tasks={inProgressTasks}
                  project={project}
                  onTaskUpdate={handleTaskUpdate}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Completed Tasks */}
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="completed">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="h-4 w-4 text-green-500" />
                  <span>Completed</span>
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                    {completedTasks.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TaskGroup
                  type="completed"
                  tasks={completedTasks}
                  project={project}
                  onTaskUpdate={handleTaskUpdate}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Tasks;

