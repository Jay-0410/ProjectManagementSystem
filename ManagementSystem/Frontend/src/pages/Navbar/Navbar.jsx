import React, { useState } from "react";
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
import {
  User,
  Plus,
  Settings,
  LogOut,
  UserCircle,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-500/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                ProjectFlow
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium group"
                  >
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                    New Project
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-3xl max-h-[90vh] border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
                  <DialogTitle className="text-lg font-semibold px-6 py-4 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm">
                    Create New Project
                  </DialogTitle>
                  <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <CreateProjectForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and User Section */}
          <div className="flex items-center space-x-6">
            {/* Search Component */}
            <div className="hidden sm:block">
              <SearchProject />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-full p-0 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-0 shadow-2xl bg-white/95 backdrop-blur-xl"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-200">
                    <UserCircle className="h-4 w-4 mr-2 text-gray-500" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-2 text-gray-500" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Online Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <Badge
                  variant="outline"
                  className="text-xs text-gray-600 border-gray-200"
                >
                  Online
                </Badge>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 p-0"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200/20 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <div className="sm:hidden">
                <SearchProject />
              </div>

              {/* Mobile New Project */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
                  <div className="overflow-y-auto max-h-[90vh]">
                    <CreateProjectForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
