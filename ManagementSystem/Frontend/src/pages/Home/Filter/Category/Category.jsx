import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { FolderOpen, Layers } from 'lucide-react'

export const categories = [
  'all',
  'web development',
  'productivity',
  'finance',
  'education',
  'iot',
  'analytics',
  'mobile',
  'devops',
  'data science',
  'design',
  'qa',
  'project management'
]

const categoryIcons = {
  'all': '🎯',
  'web development': '🌐',
  'productivity': '⚡',
  'finance': '💰',
  'education': '📚',
  'iot': '🔌',
  'analytics': '📊',
  'mobile': '📱',
  'devops': '⚙️',
  'data science': '🧠',
  'design': '🎨',
  'qa': '🧪',
  'project management': '📋'
}

const Category = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="h-4 w-4 text-gray-600" />
        <h4 className="font-medium text-gray-900">Category</h4>
      </div>
      
      <ScrollArea className="h-[240px]">
        <RadioGroup 
          value={selectedCategory} 
          onValueChange={onCategoryChange}
          className="space-y-2"
        >
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
                  isSelected ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                <RadioGroupItem 
                  value={category} 
                  id={`category-${index}`}
                  className={isSelected ? 'border-blue-500' : ''}
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <Label 
                    htmlFor={`category-${index}`} 
                    className={`capitalize cursor-pointer flex-1 text-sm ${
                      isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Label>
                </div>
                {isSelected && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            )
          })}
        </RadioGroup>
      </ScrollArea>
    </div>
  )
}

export default Category