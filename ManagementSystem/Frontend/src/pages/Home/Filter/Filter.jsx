import React from 'react'
import Category from './Category/Category'
import Tags from './Tags/Tags'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Filter as FilterIcon } from 'lucide-react'
import { useFilters } from '../../../context/FilterContext'
import { Badge } from '@/components/ui/badge'

const Filter = ({ filters, onFilterChange }) => {
  const { resetFilters } = useFilters();

  const handleResetFilters = () => {
    resetFilters();
  };

  const hasActiveFilters = filters.category !== 'all' || filters.tags !== 'all' || filters.searchKeyword;

  return (
    <div className='space-y-4'>
      <Card className='border-0 shadow-lg bg-white/70 backdrop-blur-sm'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg'>
                <FilterIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>Filters</h3>
                <p className='text-xs text-gray-500'>Refine your search</p>
              </div>
            </div>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetFilters}
                className='h-8 px-3 text-xs border-gray-200 hover:bg-gray-50'
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className='space-y-6 pt-0'>
          <Category 
            selectedCategory={filters.category}
            onCategoryChange={(category) => onFilterChange('category', category)}
          />
          <div className='border-t pt-4'>
            <Tags 
              selectedTag={filters.tags}
              onTagChange={(tag) => onFilterChange('tags', tag)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Filter Summary */}
      {hasActiveFilters && (
        <Card className='border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'>
          <CardContent className='p-4'>
            <h4 className='text-sm font-medium text-blue-900 mb-2'>Active Filters</h4>
            <div className='flex flex-wrap gap-2'>
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  {filters.category}
                </Badge>
              )}
              {filters.tags !== 'all' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  {filters.tags}
                </Badge>
              )}
              {filters.searchKeyword && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  "{filters.searchKeyword}"
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Filter