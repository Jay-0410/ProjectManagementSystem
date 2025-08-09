import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const TaskGroup = ({ type, tasks }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
      {tasks.map((task, index) => {
        return (
          <Card
            key={index}
            className="pb-2 pt-6 cursor-pointer"
            onClick={() => navigate(`/project/${task.projectId}/task/${task.id}`)}
          >
            <div className="flex justify-between items-center ">
              <CardTitle className="text-lg font-semibold text-gray-800 ml-3">
          {task.title}
              </CardTitle>
              <div className="mr-2">
          {/* Dropdown menu for task actions */}
          <DropdownMenu className="text-gray-500" onClick={e => e.stopPropagation()}>
            <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100 focus:outline-none">
              <DotsVerticalIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                Done
              </DropdownMenuItem>
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
            <CardDescription className="text-sm text-gray-600 ml-3">
              {task.description}
            </CardDescription>
            <CardContent className="text-sm text-gray-500">
              <div></div>
            </CardContent>
            <CardFooter className="pl-2">
              <div>
          <Avatar className="cursor-pointer inline-block">
            <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
          </Avatar>
              </div>
              <div className="ml-2 text-sm text-gray-500">
          {task.assignedTo}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskGroup;
