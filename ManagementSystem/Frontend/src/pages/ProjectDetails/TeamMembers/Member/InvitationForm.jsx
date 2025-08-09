import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

const InvitationForm = () => {
  return (
    <div>
      
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input type="email" placeholder="enter email here..." />
          <Button type="submit" variant="outline">
            Invite
          </Button>
        </div>
      
    </div>
  );
};

export default InvitationForm;
