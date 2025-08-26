import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusSquareIcon } from "lucide-react";
import { PlusCircledIcon, PlusIcon, PersonIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
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

const TeamMembers = ({ project }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No team data available</p>
      </div>
    );
  }

  const teamMembers = project.team || [];

  const handleInvitationSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Team Members</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
                <DialogDescription>
                  Add a new member to {project.projectName || project.name}
                </DialogDescription>
              </DialogHeader>
              <InvitationForm project={project} onSuccess={handleInvitationSuccess} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <PersonIcon className="h-4 w-4" />
          <span>{teamMembers.length} members</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <PersonIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members yet</p>
                <p className="text-sm text-gray-400">Invite people to join this project</p>
              </div>
            ) : (
              <div className="space-y-3">
            {teamMembers.map((member, index) => {
              const memberName = member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim();
              const initials = memberName ? memberName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
              
              return (
                <Accordion key={member.id || member.userId || index} type="single" collapsible className="w-full">
                  <AccordionItem value={`member-${index}`} className="border rounded-lg overflow-hidden transition-all duration-200">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={memberName} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{memberName}</p>
                          <div className="flex items-center gap-2">
                            {member.role && (
                              <Badge variant="secondary" className="text-xs">
                                {member.role}
                              </Badge>
                            )}
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 font-medium">Email</p>
                            <div className="flex items-center gap-2">
                              <EnvelopeClosedIcon className="h-3 w-3 text-gray-400" />
                              <p className="text-gray-700">{member.email}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Role</p>
                            <p className="text-gray-700">{member.role || 'Team Member'}</p>
                          </div>
                        </div>
                        
                        {/* Member Stats */}
                        <div className="border-t pt-3">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-lg font-semibold text-blue-600">
                                {project.issues?.filter(issue => issue.assignee?.userId === member.userId || issue.assignee?.id === member.id).length || 0}
                              </p>
                              <p className="text-xs text-gray-500">Assigned Tasks</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-green-600">
                                {project.issues?.filter(issue => 
                                  (issue.assignee?.userId === member.userId || issue.assignee?.id === member.id) && 
                                  issue.status === 'COMPLETED'
                                ).length || 0}
                              </p>
                              <p className="text-xs text-gray-500">Completed</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;

