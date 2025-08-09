import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusSquareIcon } from "lucide-react";
import { PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvitationForm from "./Member/InvitationForm";

const TeamMembers = () => {
  return (
    <div>
      <div className="flex items-center gap-3 ml-4 border-b pb-2">
        <div className="flex items-center gap-2 p-1 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">+ invite</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
              </DialogHeader>
              <InvitationForm />
            </DialogContent>
          </Dialog>
        </div> 
      </div>
      <div className="flex flex-col   p-4 w-full">
        <Accordion type="single" className="" collapsible>
          <AccordionItem value="item-1" className="m-0">
            <AccordionTrigger>
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-600">Shad CN</p>
                  <p className="text-xs text-gray-400">Developer</p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-600">Shad CN</p>
                  <p className="text-xs text-gray-400">Developer</p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        
      </div>
    </div>
  );
};

export default TeamMembers;
