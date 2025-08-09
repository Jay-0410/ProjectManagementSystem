import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import TeamMembers from "../TeamMembers/TeamMembers";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Details = () => {
  return (
    <div className="flex flex-row gap-4 p-4">
      <Card>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="text-lg font-semibold ml-4">Example Project </div>

            <div className="flex flex-col gap-2 mt-4 ml-6">
              <p className="text-sm text-gray-600 ">
                Description: This is a sample project description.
              </p>
              <p className="text-sm text-gray-600">Created On: 2023-10-01</p>
              <p className="text-sm text-gray-600">Last Updated: 2023-10-15</p>
            </div>

            <div className="p-4 ml-2">
              <p className="text-sm text-gray-600">
                This section can include additional details about the project,
                such as team members, milestones, or any other relevant
                information.
              </p>
            </div>

            <div className="p-4 ml-2">
              <p className="text-sm text-gray-600">
                You can also add links to related resources or documents here.
              </p>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <TeamMembers />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
};

export default Details;
