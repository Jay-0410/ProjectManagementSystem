import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import projectService from "../../../../services/projectService";
import { toast } from "react-hot-toast";

const InvitationForm = ({ project, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending invitation to:", email, "for project:", project.id);
      
      await projectService.inviteToProject(project.id, email);
      
      toast.success(`Invitation sent to ${email}!`);
      setEmail(""); // Clear the form
      
      // Call success callback to close dialog
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input 
            type="email" 
            placeholder="Enter email address..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Button 
            type="submit" 
            variant="outline"
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Invite"
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>The user will receive an email invitation to join this project.</p>
        </div>
      </form>
    </div>
  );
};

export default InvitationForm;
