import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useState, useEffect, useRef } from 'react'
import chatService from '../../../services/chatService'
import { getAuthToken } from '../../../config/dataSource'
import { toast } from 'react-hot-toast'

const ChatBox = ({ project }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollAreaRef = useRef(null);

  // Get project ID from props
  const projectId = project?.id;

  // Get current user from token
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          id: payload.userId,
          email: payload.sub,
          fullName: payload.fullName || payload.sub
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  // Fetch messages when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-content]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!projectId) {
      console.log('No project ID available, skipping message fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching messages for project:', projectId);
      const fetchedMessages = await chatService.getMessagesByProjectId(projectId);
      console.log('Fetched messages:', fetchedMessages);
      setMessages(Array.isArray(fetchedMessages) ? fetchedMessages : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      // Always set empty messages array, never show error toast for chat messages
      // This handles both "no messages found" and actual errors gracefully
      setMessages([]);
      console.log('Setting empty messages array - no error message shown to user');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  };

  const handleSendMessage = async () => {
    console.log('Sending message:', message);
    console.log('Current user:', currentUser);
    console.log('Project ID:', projectId);
    if (!message.trim() || !currentUser || !projectId) {
      if (!message.trim()) {
        toast.error('Please enter a message');
      }
      return;
    }

    try {
      setSending(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const messageData = {
        token: token,
        projectId: parseInt(projectId),
        content: message.trim()
      };

      const sentMessage = await chatService.sendMessage(messageData);
      
      // Add the new message to the list
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      setMessage("");
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full w-full p-4 shadow-lg border-0 bg-white flex flex-col max-h-full">
      <div className="flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">💬 Chat with Team</h2>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 w-full px-3 bg-gray-50 rounded-lg overflow-hidden">
        <div className="space-y-2 py-4 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-gray-500 text-sm">Loading messages...</div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-gray-500 text-sm">No messages yet. Start the conversation!</div>
                <div className="text-gray-400 text-xs mt-1">Be the first to say hello to your team</div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isCurrentUserMsg = chatService.isCurrentUserMessage(msg, currentUser?.id);
              const senderName = msg.sender?.fullName || msg.sender?.email || 'Unknown User';
              const senderInitials = chatService.getUserInitials(senderName);
              const messageTime = chatService.formatMessageTime(msg.createdAt);

              if (isCurrentUserMsg) {
                // Current user message (right side)
                return (
                  <div key={msg.id || index} className="flex justify-end mb-4">
                    <div className="flex items-end gap-2 max-w-[75%]">
                      <div className="flex flex-col items-end">
                        <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-br-md shadow-lg">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <p className="text-xs mt-1 text-blue-400">
                          {messageTime}
                        </p>
                      </div>
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-blue-600 text-white font-medium">
                          {chatService.getUserInitials(currentUser?.fullName || currentUser?.email || 'You')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                );
              } else {
                // Other user message (left side)
                return (
                  <div key={msg.id || index} className="flex justify-start mb-4">
                    <div className="flex items-end gap-2 max-w-[75%]">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-gray-300 text-gray-700">
                          {senderInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <p className="text-xs text-gray-600 mb-1 ml-1 font-medium">
                          {senderName}
                        </p>
                        <div className="bg-white border border-gray-200 text-gray-900 p-3 rounded-2xl rounded-bl-md shadow-sm">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                        <p className="text-xs mt-1 ml-1 text-gray-500">
                          {messageTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </ScrollArea>
      
      <div className="flex-shrink-0 mt-4 flex gap-3 p-3 bg-gray-50 rounded-lg border">
        <input
          type="text"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-3 border-0 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          disabled={sending || !currentUser}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={sending || !message.trim() || !currentUser}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md font-medium"
        >
          {sending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Send</span>
              <span>📤</span>
            </div>
          )}
        </button>
      </div>
      
      {!currentUser && (
        <div className="flex-shrink-0 mt-2 text-sm text-red-500 text-center">
          Please log in to send messages
        </div>
      )}
    </Card>
  )
}

export default ChatBox