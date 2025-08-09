import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import CreateTaskForm from "./NewTask/CreateTaskForm";
import { PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskGroup from "./TaskGroup/TaskGroup";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Tasks = () => {
  return (
    <div className="flex flex-col  gap-4 p-4 w-full">
      <div className="flex items-center gap-3 ml-2">
        <Dialog>
          <DialogTrigger>
            <Button
              variant="outline"
              className="h-10 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              + Task
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[400px]">
            <DialogTitle className="text-lg font-semibold">
              Create New Task
            </DialogTitle>
            
            <CreateTaskForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-[50vh] border-none py-0 px-2">
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>To-do</AccordionTrigger>
              <AccordionContent>
                <TaskGroup
                  type="todo"
                  tasks={[
                    {
                      title: "Task 1",
                      description: "Description 1",
                      assignedTo: "User 1",
                      projectId: "1",
                      id: "1",
                    },
                    {
                      title: "Task 2",
                      description: "Description 2",
                      assignedTo: "User 2",
                      projectId: "2",
                      id: "2",
                    },
                    {
                      title: "Task 3",
                      description: "Description 3",
                      assignedTo: "User 3",
                      projectId: "3",
                      id: "3",
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>In Progress</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion
            type="single"
            collapsible
            className="border rounded-lg p-2 m-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Completed</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Tasks;
