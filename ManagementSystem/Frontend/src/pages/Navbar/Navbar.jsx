import React from "react";
import SearchProject from "./SearchProject/SearchProject";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateProjectForm from "./NewProject/CreateProjectForm";
import { PersonIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center px-5 lg:px-3 py-1 bg-white shadow-md">
      <div className="flex items-center gap-5">
        <p
          className="cursor-pointer"
          onClick={handleLogoClick}
        >
          Project Management
        </p>
        <Dialog>
          <DialogTrigger className="h-10 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
            New Project
          </DialogTrigger>
          <DialogContent className="w-[400px]" >
            <DialogTitle className="text-lg font-semibold">
              Create New Project
            </DialogTitle>
            <CreateProjectForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-15 pr-5">
        <SearchProject />
        <div className="flex items-center gap-2">
          <DropdownMenu className="text-gray-500">
            <DropdownMenuTrigger className="p-2 border rounded-full hover:bg-gray-100 focus:outline-none">
              <PersonIcon className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-100 text-red-600"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>{user?.username || 'User'}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
