import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Tags as TagsIcon, Code } from 'lucide-react';

export const tags = [
  "all",
  "react",
  "vue",
  "angular",
  "node.js",
  "spring boot",
  "django",
  "flask",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp"
]

const tagColors = {
  'all': 'bg-gray-100 text-gray-700',
  'react': 'bg-blue-100 text-blue-700',
  'vue': 'bg-green-100 text-green-700',
  'angular': 'bg-red-100 text-red-700',
  'node.js': 'bg-green-100 text-green-700',
  'spring boot': 'bg-emerald-100 text-emerald-700',
  'django': 'bg-green-100 text-green-700',
  'flask': 'bg-blue-100 text-blue-700',
  'mongodb': 'bg-green-100 text-green-700',
  'postgresql': 'bg-blue-100 text-blue-700',
  'mysql': 'bg-orange-100 text-orange-700',
  'redis': 'bg-red-100 text-red-700',
  'docker': 'bg-blue-100 text-blue-700',
  'kubernetes': 'bg-blue-100 text-blue-700',
  'aws': 'bg-orange-100 text-orange-700',
  'azure': 'bg-blue-100 text-blue-700',
  'gcp': 'bg-blue-100 text-blue-700'
}

const Tags = ({ selectedTag, onTagChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TagsIcon className="h-4 w-4 text-gray-600" />
        <h4 className="font-medium text-gray-900">Technology Tags</h4>
      </div>
      
      <ScrollArea className="h-[240px]">
        <RadioGroup 
          value={selectedTag} 
          onValueChange={onTagChange}
          className="space-y-2"
        >
          {tags.map((tag, index) => {
            const isSelected = selectedTag === tag;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
                  isSelected ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                }`}
                onClick={() => onTagChange(tag)}
              >
                <RadioGroupItem 
                  value={tag} 
                  id={`tag-${index}`}
                  className={isSelected ? 'border-blue-500' : ''}
                />
                <div className="flex items-center gap-2 flex-1">
                  {tag !== 'all' && <Code className="h-3 w-3 text-gray-500" />}
                  <Label 
                    htmlFor={`tag-${index}`} 
                    className={`capitalize cursor-pointer flex-1 text-sm ${
                      isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {tag === 'all' ? 'All Tags' : tag}
                  </Label>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${tagColors[tag] || 'bg-gray-100 text-gray-700'} ${
                    isSelected ? 'ring-1 ring-blue-300' : ''
                  }`}
                >
                  {tag === 'all' ? '🎯' : '💻'}
                </Badge>
              </div>
            )
          })}
        </RadioGroup>
      </ScrollArea>
    </div>
  );
};

export default Tags;
