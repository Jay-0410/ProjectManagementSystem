import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotFilledIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = () => {
   const navigate = useNavigate();
  return (
    <Card className="w-[300px] sm:w-[200px] lg:min-w-[420px] lg:max-w-[500px] h-[200px] flex flex-col justify-between p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border border-gray-200">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <h3 onClick={() => {navigate(`/project/2`)}} className="cursor-pointer text-lg font-semibold">Project Title</h3>
            <div>
              <DotFilledIcon className="inline-block text-green-500 ml-2" />
              <span className="text-sm text-gray-500">active</span>
            </div>{" "}
          </div>
          <div>
            <DropdownMenu className="text-gray-500">
              <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100 focus:outline-none">
                  <DotsVerticalIcon className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  Share
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-500">Project Description use Progress for every creation</p>
        <div className="flex flex-wrap items-center gap-2">
          {["Category", "Tags"].map((label) => (
            <Badge key={label} className="h-7 cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200">
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
