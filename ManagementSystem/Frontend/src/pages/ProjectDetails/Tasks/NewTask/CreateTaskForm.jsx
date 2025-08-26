import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "react-hot-toast";
import issueService from "../../../../services/issueService";
import { useParams } from "react-router-dom";

import React from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

const types = [
  {
    value: "TO_DO",
    label: "To Do",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Done",
  },
];

const priorities = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
];

// Task form validation schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  dueDate: z.string().optional(),
  assigneeId: z.string().min(1, "Assignee is required"),
});

const CreateTaskForm = ({ onTaskCreated, onTaskUpdated, project, taskToEdit = null }) => {
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [assigneeOpen, setAssigneeOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [teamMembers, setTeamMembers] = React.useState([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = React.useState(false);
  
  const { projectId } = useParams(); // Get project ID from URL
  
  // Determine if we're in edit mode
  const isEditMode = !!taskToEdit;
  const formTitle = isEditMode ? 'Edit Task' : 'Create New Task';
  const submitButtonText = isEditMode ? 'Update Task' : 'Create Task';

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskToEdit?.title || '',
      description: taskToEdit?.description || '',
      status: taskToEdit?.status || 'TO_DO',
      priority: taskToEdit?.priority || 'MEDIUM',
      dueDate: taskToEdit?.dueDate || '',
      assigneeId: taskToEdit?.assignee?.id?.toString() || taskToEdit?.assigneeId?.toString() || '',
    },
  });

  // Set initial date state if editing
  React.useEffect(() => {
    if (isEditMode && taskToEdit?.dueDate) {
      setDate(new Date(taskToEdit.dueDate));
    }
  }, [isEditMode, taskToEdit]);

  // Fetch team members when component mounts or project changes
  React.useEffect(() => {
    const loadTeamMembers = async () => {
      if (!project) {
        console.warn('No project data available, cannot load team members');
        setTeamMembers([]);
        return;
      }
      
      try {
        setLoadingTeamMembers(true);
        console.log('🔄 Loading team members from project data:', project.projectName || project.name);
        
        // Use team members from project data
        let members = [];
        
        if (project.team && Array.isArray(project.team) && project.team.length > 0) {
          // Format team members for the form
          members = project.team.map(member => ({
            id: member.id || member.userId,
            userId: member.userId || member.id, // Ensure we have userId for backend
            fullName: member.fullName || member.name || 
                     (member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : '') ||
                     member.username || `User ${member.id || member.userId}`,
            username: member.username || member.email?.split('@')[0] || `user${member.id || member.userId}`,
            email: member.email || '',
            isCurrentUser: member.isCurrentUser || false,
            role: member.role || 'Member'
          }));
          console.log('✅ Using project team members:', members);
        } else if (project.teamMembers && Array.isArray(project.teamMembers) && project.teamMembers.length > 0) {
          // Alternative property name for team members
          members = project.teamMembers.map(member => ({
            id: member.id || member.userId,
            userId: member.userId || member.id, // Ensure we have userId for backend
            fullName: member.fullName || member.name || 
                     (member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : '') ||
                     member.username || `User ${member.id || member.userId}`,
            username: member.username || member.email?.split('@')[0] || `user${member.id || member.userId}`,
            email: member.email || '',
            isCurrentUser: member.isCurrentUser || false,
            role: member.role || 'Member'
          }));
          console.log('✅ Using project teamMembers:', members);
        } else {
          // Fallback: Include project owner if no team members
          if (project.owner) {
            members = [{
              id: project.owner.id || project.owner.userId,
              userId: project.owner.userId || project.owner.id,
              fullName: project.owner.fullName || project.owner.name ||
                       (project.owner.firstName && project.owner.lastName ? 
                        `${project.owner.firstName} ${project.owner.lastName}` : '') ||
                       project.owner.username || 'Project Owner',
              username: project.owner.username || project.owner.email?.split('@')[0] || 'owner',
              email: project.owner.email || '',
              isCurrentUser: project.owner.isCurrentUser || false,
              role: 'Owner'
            }];
            console.log('✅ Using project owner as assignee option:', members);
          }
        }
        
        // Sort members to put current user first, then by name
        if (members && members.length > 0) {
          members.sort((a, b) => {
            if (a.isCurrentUser) return -1;
            if (b.isCurrentUser) return 1;
            return (a.fullName || '').localeCompare(b.fullName || '');
          });
        }
        
        setTeamMembers(members || []);
        
        if (!members || members.length === 0) {
          console.warn('⚠️ No team members found in project data');
          // Don't show error toast for empty team members - this is normal for new projects
          console.log('ℹ️ Task can still be created without assignee');
        } else {
          console.log(`✅ ${members.length} team members loaded from project data`);
          
          // Auto-select current user if available and no assignee is already selected
          const currentUser = members.find(member => member.isCurrentUser);
          if (currentUser && !form.getValues('assigneeId')) {
            console.log('🎯 Auto-selecting current user:', currentUser);
            form.setValue('assigneeId', currentUser.id.toString());
          }
        }
      } catch (error) {
        console.error('❌ Error loading team members from project:', error);
        // Only show error for actual loading failures, not empty data
        if (error.message && !error.message.includes('404') && !error.message.includes('not found')) {
          toast.error('Failed to load team members: ' + error.message);
        }
        setTeamMembers([]);
      } finally {
        setLoadingTeamMembers(false);
      }
    };

    loadTeamMembers();
  }, [project, form]);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('🚀 Form submitted with data:', data);
    
    // Debug form data serialization
    if (window.testFormDataSerialization) {
      window.testFormDataSerialization(data);
    }
    
    if (!projectId) {
      console.error('❌ Project ID is missing. Cannot create task.');
      toast.error('Project ID is missing. Cannot create task.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Find the selected assignee details from team members
      let assigneeDetails = null;
      if (data.assigneeId && teamMembers.length > 0) {
        assigneeDetails = teamMembers.find(member => 
          member.id.toString() === data.assigneeId || 
          member.userId?.toString() === data.assigneeId
        );
      }

      // Format the data for the backend
      const taskData = {
        id: isEditMode ? taskToEdit.id : undefined,
        title: String(data.title || '').trim(),
        description: String(data.description || '').trim(),
        status: String(data.status || 'TO_DO').trim(),
        priority: String(data.priority || 'MEDIUM').trim(),
        projectId: parseInt(projectId),
        dueDate: data.dueDate || null,
        userId: data.assigneeId ? parseInt(data.assigneeId) : null, // Backend expects userId for assignee
        assigneeUsername: assigneeDetails?.username || null, // Include username for backend reference
        assigneeDetails: assigneeDetails // Include full assignee details for frontend use
      };

      console.log('📤 Form data received:', data);
      console.log('📤 Selected assignee details:', assigneeDetails);
      console.log('📤 Formatted task data:', taskData);
      console.log('📤 Data types check:');
      console.log('  title:', typeof taskData.title, taskData.title);
      console.log('  description:', typeof taskData.description, taskData.description);
      console.log('  status:', typeof taskData.status, taskData.status);
      console.log('  priority:', typeof taskData.priority, taskData.priority);
      console.log('  projectId:', typeof taskData.projectId, taskData.projectId);
      console.log('  dueDate:', typeof taskData.dueDate, taskData.dueDate);
      console.log('  userId (assignee):', typeof taskData.userId, taskData.userId);
      console.log('  assigneeUsername:', typeof taskData.assigneeUsername, taskData.assigneeUsername);

      // Validate required fields
      if (!taskData.title) {
        toast.error('Task title is required');
        return;
      }
      if (!taskData.projectId || isNaN(taskData.projectId)) {
        toast.error('Invalid project ID');
        return;
      }

      // Call the issue service to create or update the task
      let result;
      if (isEditMode) {
        console.log('🔄 Updating task with ID:', taskToEdit.id);
        const editableTaskData = {
          ...taskData,
          assignee : {username : assigneeDetails?.username || null},
        };
        result = await issueService.updateTask(taskToEdit.id, editableTaskData);
        console.log('✅ Task updated successfully:', result);
        toast.success('Task updated successfully!');
        
        // Notify parent component about update
        if (onTaskUpdated) {
          onTaskUpdated(result);
        }
      } else {
        console.log('🆕 Creating new task');
        result = await issueService.createIssue(taskData, projectId);
        console.log('✅ Task created successfully:', result);
        toast.success('Task created successfully!');
        
        // Notify parent component about creation
        if (onTaskCreated) {
          onTaskCreated(result);
        }
      }
      
      // Reset form only for create mode
      if (!isEditMode) {
        form.reset();
        setDate(null);
      }
      
    } catch (error) {
      console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} task:`, error);
      
      // Provide a more specific error message
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`;
      
      if (error.message) {
        // If error message is vague or empty, provide more context
        if (error.message.trim() === '' || 
            error.message.toLowerCase().includes('no message') || 
            error.message === 'undefined') {
          errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} task. Please check your input and try again.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('🔍 Final error message to display:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <DialogContent className="sm:max-w-[455px]">
        <DialogTitle className="text-lg font-semibold">
          {formTitle}
        </DialogTitle>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Enter task title..." 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Enter task description..." 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                {/* Status Field */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={typeOpen}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? types.find((type) => type.value === field.value)?.label
                                : "Select status..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search status..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                  {types.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setTypeOpen(false);
                                      }}
                                    >
                                      {type.label}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === type.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Priority Field */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={priorityOpen}
                              className="w-full justify-between"
                            >
                            {field.value
                              ? priorities.find(
                                  (priority) => priority.value === field.value
                                )?.label
                              : "Select priority..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search priority..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No priority found.</CommandEmpty>
                              <CommandGroup>
                                {priorities.map((priority) => (
                                  <CommandItem
                                    key={priority.value}
                                    value={priority.value}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                      setPriorityOpen(false);
                                    }}
                                  >
                                    {priority.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value === priority.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assignee Field */}
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee *</FormLabel>
                      <FormControl>
                        <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={assigneeOpen}
                              className="w-full justify-between"
                              disabled={loadingTeamMembers}
                            >
                              {loadingTeamMembers ? (
                                "Loading members..."
                              ) : field.value ? (
                                teamMembers.find(
                                  (member) => member.id.toString() === field.value
                                )?.fullName || "Unknown Member"
                              ) : (
                                "Select assignee..."
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search team member..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {loadingTeamMembers ? "Loading..." : "No team members found."}
                                </CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value=""
                                    onSelect={() => {
                                      field.onChange("");
                                      setAssigneeOpen(false);
                                    }}
                                  >
                                    Unassigned
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        !field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                  {teamMembers.map((member) => (
                                    <CommandItem
                                      key={member.id}
                                      value={member.id.toString()}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setAssigneeOpen(false);
                                      }}
                                    >
                                      <div className="flex flex-col flex-1">
                                        <span>{member.fullName}
                                          {member.isCurrentUser && <span className="text-xs text-blue-600 ml-1">(You)</span>}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{member.role} • {member.email}</span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === member.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Due Date Field */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex flex-row gap-3">
                      <Label htmlFor="date" className="px-1">
                        Due on
                      </Label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <div className="relative flex gap-2">
                          <PopoverTrigger asChild>
                            <Input
                              {...field}
                              id="date"
                              placeholder="Select due date..."
                              className="bg-background pr-10 cursor-pointer"
                              readOnly
                              onClick={() => setCalendarOpen(true)}
                              onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  setCalendarOpen(true);
                                }
                              }}
                            />
                          </PopoverTrigger>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-picker"
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                              onClick={() => setCalendarOpen(true)}
                              tabIndex={-1}
                            >
                              {/* <CalendarIcon className="size-3.5" /> */}
                              <span className="sr-only">Select date</span>
                            </Button>
                          </PopoverTrigger>
                        </div>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              if (selectedDate) {
                                const formattedDate = selectedDate.toISOString().split('T')[0];
                                field.onChange(formattedDate);
                              } else {
                                field.onChange('');
                              }
                              setCalendarOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? `${isEditMode ? 'Updating' : 'Creating'} Task...` : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  );
};

export default CreateTaskForm;
