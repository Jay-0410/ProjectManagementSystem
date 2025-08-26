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
});

const CreateTaskForm = ({ onTaskCreated }) => {
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { projectId } = useParams(); // Get project ID from URL

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TO_DO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('🚀 Form submitted with data:', data);
    
    if (!projectId) {
      toast.error('Project ID is missing. Cannot create task.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Format the data for the backend
      const taskData = {
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        projectId: parseInt(projectId),
        dueDate: data.dueDate || null,
        userId: null // Can be set later when assigning to user
      };

      console.log('📤 Sending task data to backend:', taskData);

      // Call the issue service to create the task
      const createdTask = await issueService.createIssue(taskData, projectId);
      
      console.log('✅ Task created successfully:', createdTask);
      toast.success('Task created successfully!');
      
      // Reset form
      form.reset();
      setDate(null);
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated(createdTask);
      }
      
    } catch (error) {
      console.error('❌ Error creating task:', error);
      toast.error(error.message || 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[455px]">
          <DialogTitle className="text-lg font-semibold">
            Create New Task
          </DialogTitle>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field}
                        className="mt-4" 
                        placeholder="Type title here..." 
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
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Type description here..." 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-row gap-2">
                {/* Status Field */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={typeOpen}
                            className="w-[200px] justify-between"
                          >
                            {field.value
                              ? types.find((type) => type.value === field.value)?.label
                              : "Select type..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search type..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No type found.</CommandEmpty>
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
                                        "ml-auto",
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
                      <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={priorityOpen}
                            className="w-[200px] justify-between"
                          >
                            {field.value
                              ? priorities.find(
                                  (priority) => priority.value === field.value
                                )?.label
                              : "Select priority..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
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
              <Button variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  );
};

export default CreateTaskForm;
