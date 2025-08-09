import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categories } from '@/pages/Home/Filter/Category/Category'
import { tags } from '@/pages/Home/Filter/Tags/Tags'
import React from 'react'
import { useForm } from 'react-hook-form'

const CreateProjectForm = () => {
    const handleTagsChange = (tag) => {
        const currentTags = form.getValues('tags');
        if (currentTags.includes(tag)) {
            // If tag already exists, remove it
            form.setValue('tags', currentTags.filter(t => t !== tag));
        } else {
            // If tag doesn't exist, add it
            form.setValue('tags', [...currentTags, tag]);
        }
    }
    const form = useForm({
        defaultValues: {
            projectName: '',
            description: '',
            category: '',
            tags: [],
            startDate: '',
            endDate: '',
        },
    })
  return (
    <div className='flex flex-col gap-4'>
        <Form {...form}>
            <FormField
            
                control={form.control}
                name = "projectName"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <input
                                {...field}
                                placeholder="project name..."
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type='text'
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
            
                control={form.control}
                name = "description"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <input
                                {...field}
                                placeholder="project description..."
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type='text'
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name = "category"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Select
                                value={field.value}
                                onValueChange={
                                    (value) => field.onChange(value)
                                }
                            >
                                <SelectTrigger className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="choose category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((tag) => (
                                        <SelectItem key={tag} value={tag}>
                                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
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
                name = "tags"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Select
                                // value={field.value}
                                onValueChange={
                                    (value) => handleTagsChange(value)
                                }
                            >
                                <SelectTrigger className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="select tags..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {tags.map((tag) => (
                                        <SelectItem key={tag} value={tag}>
                                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value.map((tag, index) => (
                                        <div key={index} className="inline-flex items-center gap-2 mb-2" onClick={() => handleTagsChange(tag)}>
                                        <span key={index} className="h-auto px-2 py-1 text-sm rounded-md cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200">
                                            {tag}
                                        </span>
                                        </div>
                                    ))}
                            </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <DialogClose>
                {false ? 
                    <div>
                        <p>You can create only 3 project with <b>Free Plan</b></p>
                    </div>
                    : <Button type='submit' className='w-full py-2 mt-4' >Create Project</Button>
                }
            </DialogClose>
    </Form>

    </div>
  )
}

export default CreateProjectForm