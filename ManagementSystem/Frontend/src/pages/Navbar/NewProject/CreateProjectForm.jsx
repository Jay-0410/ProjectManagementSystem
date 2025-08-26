import { Button } from '@/components/ui/button'
import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { categories } from '@/pages/Home/Filter/Category/Category'
import { tags } from '@/pages/Home/Filter/Tags/Tags'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import projectService from '../../../services/projectService'
import { shouldUseMockData, isAuthenticated } from '../../../config/dataSource'
import authUtils from '../../../utils/authUtils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Plus,
  Folder,
  Tag,
  Zap,
  Rocket,
  Star,
  Heart,
  Hash,
  Type,
  MessageSquare
} from 'lucide-react'

// Form validation schema
const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required').min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed')
    .refine((tags) => new Set(tags).size === tags.length, {
      message: 'Duplicate tags are not allowed',
    }),
});

const CreateProjectForm = ({ projectToEdit = null, onProjectUpdated = null }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [focusedField, setFocusedField] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [projectNameSuggestions, setProjectNameSuggestions] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    // Determine if we're in edit mode
    const isEditMode = !!projectToEdit;
    const pageTitle = isEditMode ? 'Edit Project' : 'Create New Project';
    const submitButtonText = isEditMode ? 'Update Project' : 'Create Project';

    // Step-based form progression
    const steps = [
        { id: 1, title: 'Basic Info', icon: Folder },
        { id: 2, title: 'Category & Tags', icon: Tag },
        { id: 3, title: 'Review', icon: CheckCircle }
    ];

    // Initialize form first
    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            projectName: projectToEdit?.name || projectToEdit?.projectName || '',
            description: projectToEdit?.description || '',
            category: projectToEdit?.category || '',
            tags: projectToEdit?.tags || [],
        },
    });

    // Generate project name suggestions based on category and tags
    useEffect(() => {
        const category = form.watch('category');
        const tags = form.watch('tags') || [];
        
        if (category && tags.length > 0) {
            const suggestions = [
                `${category.charAt(0).toUpperCase() + category.slice(1)} ${tags[0]?.charAt(0).toUpperCase() + tags[0]?.slice(1)} App`,
                `My ${category} Project`,
                `${tags[0]?.charAt(0).toUpperCase() + tags[0]?.slice(1)} ${category} Hub`,
                `Ultimate ${category} Solution`
            ].filter(Boolean);
            setProjectNameSuggestions(suggestions);
        }
    }, [form.watch('category'), form.watch('tags')]);

    const handleTagsChange = (tag, fieldOnChange, currentValue) => {
        const currentTags = currentValue || [];
        let newTags;
        if (currentTags.includes(tag)) {
            // If tag already exists, remove it
            newTags = currentTags.filter(t => t !== tag);
            console.log(`🏷️ Removed tag: ${tag}`);
        } else {
            // If tag doesn't exist, add it
            newTags = [...currentTags, tag];
            console.log(`🏷️ Added tag: ${tag}`);
        }
        fieldOnChange(newTags); // Update the form field properly
        console.log('🏷️ Current tags array:', newTags);
        console.log('🏷️ Total tags selected:', newTags.length);
    }

    const onSubmit = async (data) => {
        console.log('🚀 Form submission started...', data);
        console.log('🔍 Is already submitting?', isSubmitting);
        
        if (isSubmitting) {
            console.log('⚠️ Form is already submitting, ignoring duplicate submission');
            return;
        }
        
        try {
            setIsSubmitting(true);
            setSubmitError('');
            console.log('🔄 Reset error and set isSubmitting to true');

            // Check authentication for server requests
            if (!shouldUseMockData() && !isAuthenticated()) {
                setSubmitError('Authentication required. Please log in first.');
                console.warn('🔒 Authentication required for server requests');
                return;
            }

            // Transform form data to match API expected format
            const projectData = {
                name: data.projectName,  // Backend expects 'name', not 'title'
                description: data.description,
                category: data.category,
                tags: data.tags,  // This is correct - backend expects array of strings
                startDate: data.startDate,
                endDate: data.endDate,
                status: isEditMode ? (projectToEdit.status || 'ACTIVE') : 'ACTIVE', // Preserve existing status or default
                // Add any other required fields for your API
            };

            console.log(`🚀 ${isEditMode ? 'Updating' : 'Creating'} project via: ${shouldUseMockData() ? 'Mock Data' : 'Server API'}`);
            console.log('📊 Form data received:', data);
            console.log('📊 Project data being sent:', projectData);
            console.log('🏷️ Multiple Tags debugging:');
            console.log('   Form tags:', data.tags);
            console.log('   Form tags type:', Array.isArray(data.tags) ? 'Array' : typeof data.tags);
            console.log('   Form tags length:', data.tags ? data.tags.length : 'undefined');
            console.log('   Project data tags:', projectData.tags);
            console.log('   Ready to send to backend as List<String>:', JSON.stringify(projectData.tags));

            let response;
            if (isEditMode) {
                // Update existing project
                const projectId = projectToEdit.id || projectToEdit.projectId;
                console.log('📝 Updating project with ID:', projectId);
                response = await projectService.updateProject(projectId, projectData);
                console.log('✅ Project updated successfully:', response);
                toast.success('Project updated successfully!');
                
                // Call callback if provided
                if (onProjectUpdated) {
                    onProjectUpdated(response);
                }
            } else {
                // Create new project
                response = await projectService.createProject(projectData);
                console.log('✅ Project created successfully:', response);
                console.log('🔍 About to show success toast...');
                
                // Use toast instead of state message for better UX
                toast.success('Project created successfully!');
                console.log('🔍 Success toast shown');
            }

            // Reset form only if not in edit mode
            if (!isEditMode) {
                form.reset();
            }

            // Navigate to the project or project list immediately for better UX
            if (response.id || response.projectId) {
                navigate(`/project/${response.id || response.projectId}`);
            } else {
                // If no ID in response, go to home page
                navigate('/');
            }

        } catch (error) {
            console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} project:`, error);
            
            // Handle specific authentication errors
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                setSubmitError('Authentication failed. Please log in again.');
                console.warn('🔒 Authentication error - token may be expired');
            } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                setSubmitError(`You do not have permission to ${isEditMode ? 'update' : 'create'} projects.`);
            } else {
                setSubmitError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 opacity-80 rounded-2xl"></div>
      
      
      {/* Scrollable Content Container */}
      <div className="relative z-10 overflow-y-auto max-h-[calc(90vh-80px)]">
        <div className="p-3 sm:p-4 md:p-6 space-y-4">
          {/* Header Section */}
          <div className="text-center space-y-3 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {isEditMode ? 'Update Your Project Details' : 'Bring Your Ideas to Life'}
              </span>
            </div>
          
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <div 
                      className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse opacity-75"></div>
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-400' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Message */}
                {}
                {submitError && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 backdrop-blur-sm animate-in slide-in-from-top duration-300">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{submitError}</p>
                        {submitError.includes('Authentication') && (
                          <Button
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              authUtils.setMockToken();
                              setSubmitError('');
                              console.log('🧪 Mock token set for testing');
                            }}
                            className="mt-2 h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                          >
                            Set Mock Token for Testing
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Development Helper */}
                {!shouldUseMockData() && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${isAuthenticated() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-blue-800">
                          Auth Status: {isAuthenticated() ? 
                            <span className="font-medium text-green-700">Authenticated</span> : 
                            <span className="font-medium text-red-700">Not Authenticated</span>
                          }
                        </span>
                      </div>
                      {!isAuthenticated() && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            authUtils.setMockToken();
                            window.location.reload();
                          }}
                          className="h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          Set Mock Token
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step Content */}
                <div className="relative space-y-4">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm animate-in slide-in-from-right duration-300">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="projectName"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Type className="h-4 w-4" />
                                <span>Project Name</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    placeholder="Enter your amazing project name..."
                                    onFocus={() => setFocusedField('projectName')}
                                    onBlur={() => setFocusedField('')}
                                    className={`h-10 rounded-lg border transition-all duration-200 ${
                                      focusedField === 'projectName' 
                                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  />
                                  {focusedField === 'projectName' && (
                                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                                      <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                                    </div>
                                  )}
                                </div>
                              </FormControl>

                              {/* Project Name Suggestions */}
                              {projectNameSuggestions.length > 0 && focusedField === 'projectName' && !field.value && (
                                <div className="space-y-2">
                                  <p className="text-xs text-gray-500">💡 Suggestions:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {projectNameSuggestions.slice(0, 3).map((suggestion, index) => (
                                      <Badge 
                                        key={index}
                                        variant="outline"
                                        className="text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                                        onClick={() => field.onChange(suggestion)}
                                      >
                                        <Zap className="h-3 w-3 mr-1" />
                                        {suggestion}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <MessageSquare className="h-4 w-4" />
                                <span>Description</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Textarea
                                    {...field}
                                    placeholder="Describe your project vision and goals..."
                                    onFocus={() => setFocusedField('description')}
                                    onBlur={() => setFocusedField('')}
                                    className={`min-h-[80px] max-h-[120px] rounded-lg border transition-all duration-200 resize-none ${
                                      focusedField === 'description' 
                                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  />
                                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {field.value?.length || 0}/500
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            disabled={!form.watch('projectName') || !form.watch('description')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 h-9"
                          >
                            Next Step <Plus className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Category & Technologies */}
                  {currentStep === 2 && (
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm animate-in slide-in-from-right duration-300">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Tag className="h-4 w-4 text-purple-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Category & Technologies</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Folder className="h-4 w-4" />
                                <span>Project Category</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => field.onChange(value)}
                                >
                                  <SelectTrigger className="h-10 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                                    <SelectValue placeholder="Choose category..." />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-lg border shadow-lg bg-white">
                                    {categories.map((category) => (
                                      <SelectItem 
                                        key={category} 
                                        value={category}
                                        className="rounded hover:bg-purple-50 focus:bg-purple-50 transition-colors duration-200 p-2"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <span className="text-lg">
                                            {category === 'web' ? '🌐' : 
                                             category === 'mobile' ? '📱' : 
                                             category === 'desktop' ? '💻' : 
                                             category === 'ai' ? '🤖' : 
                                             category === 'blockchain' ? '⛓️' : '📁'}
                                          </span>
                                          <span className="capitalize font-medium">{category}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Hash className="h-4 w-4" />
                                <span>Technologies</span>
                                <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                                  {field.value?.length || 0} selected
                                </Badge>
                              </FormLabel>
                              
                              {/* Quick Selection Buttons - Compact Grid */}
                              <div className="grid grid-cols-3 gap-2">
                                {tags.filter(tag => tag !== 'all').slice(0, 6).map((tag) => {
                                  const isSelected = field.value?.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => handleTagsChange(tag, field.onChange, field.value)}
                                      className={`p-2 rounded-lg border text-xs transition-all duration-200 text-left ${
                                        isSelected 
                                          ? 'border-purple-300 bg-purple-50 text-purple-800' 
                                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-1">
                                        <span className="text-sm">
                                          {tag === 'react' ? '⚛️' :
                                           tag === 'javascript' ? '🟨' :
                                           tag === 'python' ? '🐍' :
                                           tag === 'java' ? '☕' :
                                           tag === 'nodejs' ? '🟢' :
                                           tag === 'typescript' ? '🔷' :
                                           '⚡'}
                                        </span>
                                        <span className="capitalize font-medium truncate">{tag}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* More Technologies Dropdown */}
                              <FormControl>
                                <Select
                                  onValueChange={(value) => handleTagsChange(value, field.onChange, field.value)}
                                >
                                  <SelectTrigger className="h-9 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                                    <SelectValue placeholder="Browse more technologies..." />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-lg border shadow-lg bg-white max-h-48">
                                    <ScrollArea className="h-full">
                                      {tags.filter(tag => tag !== 'all').map((tag) => {
                                        const isSelected = field.value?.includes(tag);
                                        return (
                                          <SelectItem 
                                            key={tag} 
                                            value={tag}
                                            className={`rounded transition-colors duration-200 ${
                                              isSelected ? "bg-purple-50 text-purple-700 font-medium" : "hover:bg-gray-50"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center space-x-2">
                                                <span className="text-sm">
                                                  {tag === 'react' ? '⚛️' :
                                                   tag === 'javascript' ? '🟨' :
                                                   tag === 'python' ? '🐍' :
                                                   tag === 'java' ? '☕' :
                                                   tag === 'nodejs' ? '🟢' :
                                                   tag === 'typescript' ? '🔷' :
                                                   '⚡'}
                                                </span>
                                                <span className="capitalize">{tag}</span>
                                              </div>
                                              {isSelected && (
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                              )}
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </ScrollArea>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              
                              {/* Selected Technologies Display */}
                              {field.value && field.value.length > 0 && (
                                <div className="space-y-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                                  <div className="flex items-center space-x-2">
                                    <Heart className="h-3 w-3 text-purple-600" />
                                    <span className="text-xs font-medium text-purple-800">Selected:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {field.value.map((tag, index) => (
                                      <Badge 
                                        key={index}
                                        variant="secondary"
                                        className="text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200 px-2 py-1 bg-white border-purple-200"
                                        onClick={() => handleTagsChange(tag, field.onChange, field.value)}
                                      >
                                        <span className="text-xs mr-1">
                                          {tag === 'react' ? '⚛️' :
                                           tag === 'javascript' ? '🟨' :
                                           tag === 'python' ? '🐍' :
                                           tag === 'java' ? '☕' :
                                           tag === 'nodejs' ? '🟢' :
                                           tag === 'typescript' ? '🔷' :
                                           '⚡'}
                                        </span>
                                        <span className="capitalize font-medium">{tag}</span>
                                        <X className="h-3 w-3 ml-1 opacity-50 hover:opacity-100 transition-opacity duration-200" />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(1)}
                            className="rounded-lg h-9"
                          >
                            Previous
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            disabled={!form.watch('category') || !form.watch('tags')?.length}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg px-4 h-9"
                          >
                            Review <CheckCircle className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <Card className="border shadow-sm bg-white/90 backdrop-blur-sm animate-in slide-in-from-right duration-300">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Review & Create</h3>
                        </div>

                        {/* Project Preview - Compact */}
                        <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-blue-200/50">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-gray-900 truncate">{form.watch('projectName') || 'Your Project'}</h4>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <span className="text-lg">
                                {form.watch('category') === 'web' ? '🌐' : 
                                 form.watch('category') === 'mobile' ? '📱' : 
                                 form.watch('category') === 'desktop' ? '💻' : 
                                 form.watch('category') === 'ai' ? '🤖' : 
                                 form.watch('category') === 'blockchain' ? '⛓️' : '📁'}
                              </span>
                              <Badge className="capitalize bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {form.watch('category')}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {form.watch('description') || 'No description provided'}
                          </p>
                          
                          {form.watch('tags')?.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-600">Technologies:</p>
                              <div className="flex flex-wrap gap-1">
                                {form.watch('tags').map((tag, index) => (
                                  <Badge key={index} variant="outline" className="bg-white/80 border-gray-300 text-xs">
                                    <span className="text-xs mr-1">
                                      {tag === 'react' ? '⚛️' :
                                       tag === 'javascript' ? '🟨' :
                                       tag === 'python' ? '🐍' :
                                       tag === 'java' ? '☕' :
                                       tag === 'nodejs' ? '🟢' :
                                       tag === 'typescript' ? '🔷' :
                                       '⚡'}
                                    </span>
                                    <span className="capitalize">{tag}</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            className="rounded-lg h-9"
                          >
                            Previous
                          </Button>
                          
                          <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded-lg px-6 h-9" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Rocket className="h-4 w-4" />
                                <span>{submitButtonText}</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectForm