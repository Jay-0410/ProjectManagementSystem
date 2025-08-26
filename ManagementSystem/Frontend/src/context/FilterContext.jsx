import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    tags: 'all',
    searchKeyword: ''
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      tags: 'all',
      searchKeyword: ''
    });
  };

  return (
    <FilterContext.Provider value={{
      filters,
      handleFilterChange,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};
