import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import projectService from '../../services/projectService';
import { toast } from 'react-hot-toast';

const InvitationAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);

  const invitationToken = searchParams.get('token');

  useEffect(() => {
    if (!invitationToken) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    acceptInvitation();
  }, [invitationToken]);

  const acceptInvitation = async () => {
    try {
      setLoading(true);
      console.log('Accepting invitation with token:', invitationToken);
      
      const result = await projectService.acceptInvitation(invitationToken);
      
      setInvitation(result);
      setSuccess(true);
      toast.success('Invitation accepted successfully!');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation. The link may be expired or invalid.');
      toast.error('Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProject = () => {
    if (invitation && invitation.project) {
      navigate(`/project/${invitation.project.id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-semibold">Processing Invitation...</h2>
              <p className="text-gray-600 text-center">Please wait while we process your invitation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
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
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
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
              {invitation && invitation.project && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    {invitation.project.projectName || invitation.project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {invitation.project.description}
                  </p>
                </div>
              )}
              <div className="flex flex-col space-y-3 mt-6">
                <Button onClick={handleGoToProject} className="w-full">
                  Go to Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default InvitationAccept;
