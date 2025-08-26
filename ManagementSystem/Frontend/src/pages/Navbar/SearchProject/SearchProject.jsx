import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, Command } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useFilters } from "../../../context/FilterContext";
import { Button } from "@/components/ui/button";

const SearchProject = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  // Check if we're in a context where filters are available
  let filters, handleFilterChange;
  
  try {
    const filterContext = useFilters();
    filters = filterContext.filters;
    handleFilterChange = filterContext.handleFilterChange;
  } catch (error) {
    // Not in FilterContext, use local state or do nothing
    filters = { searchKeyword: '' };
    handleFilterChange = () => {};
  }

  // Sync local state with filter context
  useEffect(() => {
    setLocalSearch(filters.searchKeyword || '');
  }, [filters.searchKeyword]);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    if (handleFilterChange) {
      handleFilterChange('searchKeyword', value);
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    if (handleFilterChange) {
      handleFilterChange('searchKeyword', '');
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative group">
        {/* Search Icon */}
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
            isFocused || localSearch 
              ? 'text-blue-500' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`} 
        />
        
        {/* Input Field */}
        <Input
          onChange={(e) => handleSearchChange(e.target.value)}
          value={localSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search projects..."
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          inputMode="search"
          aria-label="Search projects"
          className={`w-full pl-10 pr-10 py-2 h-9 rounded-full border-0 bg-gray-100 text-gray-900 placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:shadow-lg
            hover:bg-gray-50 hover:shadow-md transition-all duration-200
            ${isFocused ? 'shadow-lg bg-white' : ''}
          `}
        />
        
        {/* Clear Button */}
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="h-3 w-3 text-gray-500" />
          </Button>
        )}
        
        {/* Keyboard Shortcut Hint */}
        {!isFocused && !localSearch && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center space-x-1 text-xs text-gray-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}
      </div>
      
      {/* Search Results Dropdown could be added here */}
      {isFocused && localSearch && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200/20 backdrop-blur-xl z-50 overflow-hidden">
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2">Search Results</div>
            <div className="text-sm text-gray-400 py-4 text-center">
              Press Enter to search "{localSearch}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProject;
