import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import projectService from "../../services/projectService";

const TokenAcceptanceForm = ({ trigger, onSuccess }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error("Please enter an invitation token");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Accepting invitation with token:', token);
      
      const result = await projectService.acceptInvitation(token.trim());
      
      setInvitation(result);
      setSuccess(true);
      toast.success('Invitation accepted successfully!');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      const errorMessage = error.message || 'Failed to accept invitation. The token may be expired or invalid.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProject = () => {
    if (invitation && invitation.project) {
      navigate(`/project/${invitation.project.id}`);
    } else if (invitation && invitation.projectId) {
      navigate(`/project/${invitation.projectId}`);
    } else {
      navigate('/');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setToken('');
    setLoading(false);
    setSuccess(false);
    setError(null);
    setInvitation(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // Loading state
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold">Processing Invitation...</h3>
            <p className="text-gray-600 text-center">Please wait while we process your invitation token.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircledIcon className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-xl font-semibold text-green-600">
            Invitation Accepted!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Welcome to the team! You have successfully joined the project.
            </p>
            {invitation && (invitation.project || invitation.projectId) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {invitation.project?.projectName || invitation.project?.name || 'Project'}
                </h3>
                {invitation.project?.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {invitation.project.description}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col space-y-3 mt-6">
              <Button onClick={handleGoToProject} className="w-full">
                Go to Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/');
                  setIsDialogOpen(false);
                  resetForm();
                }}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CrossCircledIcon className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-center text-xl font-semibold text-red-600">
            Invitation Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => {
                setError(null);
                setToken('');
              }}
              className="w-full"
            >
              Try Another Token
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main form state
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="token">Invitation Token</Label>
        <Input
          id="token"
          type="text"
          placeholder="Enter your invitation token..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          Enter the invitation token you received to join a project.
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={loading || !token.trim()}
          className="flex-1"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            "Accept Invitation"
          )}
        </Button>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
      </div>
    </form>
  );

  // If used as a standalone component
  if (!trigger) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Join Project</CardTitle>
          <CardDescription className="text-center">
            Enter your invitation token to join a project team.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {formContent}
        </CardContent>
      </Card>
    );
  }

  // If used with a trigger (dialog)
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Project</DialogTitle>
          <DialogDescription>
            Enter your invitation token to join a project team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenAcceptanceForm;
