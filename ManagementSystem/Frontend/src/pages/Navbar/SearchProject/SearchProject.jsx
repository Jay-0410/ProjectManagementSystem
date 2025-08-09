import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";

const SearchProject = () => {
  const handleSearchChange = (value) => {
    // Handle the search input change
    console.log("Search value:", value);
    // You can implement your search logic here, such as filtering projects
  }
  return (
    <div className=" relative flex items-center justify-center p-2 w-full max-w-md">
      <MagnifyingGlassIcon className="text-gray-500 absolute left-5 " />
        <Input
        onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search projects..."
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          inputMode="search"
          aria-label="Search projects"
          className='w-[300px] lg:w-[400px] bg-transparent pl-10 pr-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 focus:border-blue-500' 
        />
        
    </div>
  );
};

export default SearchProject;
