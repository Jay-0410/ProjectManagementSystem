import React from "react";
import ChatBox from "./ChatBox/ChatBox";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Details from "./Details/Details";
import Tasks from "./Tasks/Tasks";
import TeamMembers from "./TeamMembers/TeamMembers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const ProjectDetails = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedTab, setSelectedTab] = React.useState("projectDetails");

  const handleClick = (e) => {
    // Handle click event
    setSelectedTab(e.target.getAttribute("name"));
    console.log("Element clicked");
  };
  return (
    <div className="h-[82vh]">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-full"
      >
        <ResizablePanel defaultSize={65} >
          <div className="flex items-center w-full justify-center p-6">
            
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Product Details</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Details />
                </TabsContent>
                <TabsContent value="tasks">
                  <Tasks />
                </TabsContent>
              </Tabs>
            
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35}>
          <div className="flex  items-center justify-center p-6">
            <ChatBox />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectDetails;
