import React, { useState } from 'react'
import ProjectList from './ProjectList/ProjectList'
import Filter from './Filter/Filter'
import { useFilters } from '../../context/FilterContext'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Grid3X3, List, LayoutGrid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const Body = () => {
  const { filters, handleFilterChange } = useFilters();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.tags !== 'all') count++;
    if (filters.searchKeyword) count++;
    return count;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Modern Header Section */}
      <div className='bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                Project Dashboard
              </h1>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  {getActiveFiltersCount()} filters active
                </Badge>
              )}
            </div>
            
            <div className='flex items-center gap-3'>
              {/* View Mode Toggle */}
              <div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className='h-8 w-8 p-0'
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className='h-8 w-8 p-0'
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant={isFilterOpen ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className='flex items-center gap-2'
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-6'>
        <div className={`flex gap-6 transition-all duration-300 ${isFilterOpen ? 'grid-cols-1 lg:grid-cols-4' : ''}`}>
          {/* Sidebar Filter - Modern Card Style */}
          {isFilterOpen && (
            <div className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
              <div className='sticky top-24'>
                <Filter 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          )}
          
          {/* Project List - Full width when filter is closed */}
          <div className={`flex-1 transition-all duration-300 ${isFilterOpen ? '' : 'w-full'}`}>
            <ProjectList 
              filters={filters} 
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Body