import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  PaperPlaneIcon, 
  FaceIcon, 
  DotsHorizontalIcon,
  CheckIcon,
  DoubleArrowDownIcon
} from '@radix-ui/react-icons'
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
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

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
        // Error parsing token - continue without current user
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
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-content]');
    if (scrollContainer) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom && messages.length > 0);
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-content]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const fetchMessages = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedMessages = await chatService.getMessagesByProjectId(projectId);
      setMessages(Array.isArray(fetchedMessages) ? fetchedMessages : []);
    } catch (error) {
      // Always set empty messages array, never show error toast for chat messages
      // This handles both "no messages found" and actual errors gracefully
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
    
    // Simulate typing indicator (in real app, you'd send this to other users)
    if (newMessage.trim() && !isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleSendMessage = async () => {
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
      
      // Add the new message to the list with optimistic UI
      const optimisticMessage = {
        ...sentMessage,
        id: sentMessage.id || Date.now(),
        status: 'sent',
        createdAt: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      setMessage("");
      
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
    } catch (error) {
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

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const shouldShowDateSeparator = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const previousDate = new Date(previousMsg.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  return (
    <Card className="h-full w-full shadow-xl border-0 bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col max-h-full overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">💬</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Team Chat</h2>
              <p className="text-blue-100 text-sm">{project?.name || 'Project Discussion'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full w-full">
          <div className="p-4 space-y-1 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-l-blue-400 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Loading conversation...</div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center max-w-sm">
                  <div className="text-6xl mb-4 opacity-50">💬</div>
                  <div className="text-gray-600 text-lg font-medium mb-2">No messages yet</div>
                  <div className="text-gray-500 text-sm leading-relaxed">
                    Start the conversation! Share ideas, updates, or just say hello to your team.
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isCurrentUserMsg = chatService.isCurrentUserMessage(msg, currentUser?.id);
                const senderName = msg.sender?.fullName || msg.sender?.email || 'Unknown User';
                const senderInitials = chatService.getUserInitials(senderName);
                const messageTime = chatService.formatMessageTime(msg.createdAt);
                const showDateSeparator = shouldShowDateSeparator(msg, messages[index - 1]);

                return (
                  <React.Fragment key={msg.id || index}>
                    {/* Date Separator */}
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                          {formatMessageDate(msg.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div className={`flex mb-3 ${isCurrentUserMsg ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`flex items-end gap-2 max-w-[75%] ${isCurrentUserMsg ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="w-8 h-8 flex-shrink-0 ring-2 ring-white shadow-md">
                          <AvatarFallback className={`text-xs font-bold ${
                            isCurrentUserMsg 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                              : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                          }`}>
                            {isCurrentUserMsg 
                              ? chatService.getUserInitials(currentUser?.fullName || currentUser?.email || 'You')
                              : senderInitials
                            }
                          </AvatarFallback>
                        </Avatar>

                        <div className={`flex flex-col ${isCurrentUserMsg ? 'items-end' : 'items-start'}`}>
                          {!isCurrentUserMsg && (
                            <p className="text-xs text-gray-600 mb-1 ml-1 font-medium">
                              {senderName}
                            </p>
                          )}
                          
                          <div className={`group relative max-w-full ${
                            isCurrentUserMsg
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                              : 'bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                          } p-3 shadow-md hover:shadow-lg transition-all duration-200`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            
                            {/* Message status indicator for sent messages */}
                            {isCurrentUserMsg && (
                              <div className="flex items-center gap-1 mt-1 justify-end">
                                <CheckIcon className="w-3 h-3 text-blue-200" />
                                {msg.status === 'delivered' && <CheckIcon className="w-3 h-3 text-blue-200 -ml-1" />}
                              </div>
                            )}
                          </div>
                          
                          <p className={`text-xs mt-1 ${
                            isCurrentUserMsg ? 'text-blue-400 mr-1' : 'text-gray-500 ml-1'
                          }`}>
                            {messageTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 max-w-[75%]">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-gray-300 text-gray-700">
                      <DotsHorizontalIcon className="w-4 h-4 animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-200 rounded-2xl rounded-bl-md p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-75"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-0 animate-in slide-in-from-bottom-2 duration-300"
            size="sm"
          >
            <DoubleArrowDownIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Enhanced Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder={`Message ${project?.name || 'your team'}...`}
                className="min-h-[50px] max-h-32 resize-none border-2 border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 rounded-2xl px-4 py-3 pr-12 bg-white/90 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending || !currentUser}
              />
              
              {/* Character count indicator for longer messages */}
              {message.length > 100 && (
                <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white/80 rounded px-1">
                  {message.length}/500
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={!message.trim() || sending || !currentUser}
              className="h-[50px] w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
              size="sm"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PaperPlaneIcon className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
          
          {/* Status messages */}
          {!currentUser ? (
            <div className="mt-3 text-xs text-red-500 flex items-center gap-2">
              <span>⚠️</span>
              <span>Please log in to send messages</span>
            </div>
          ) : messages.length === 0 && !message && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <span className="opacity-60">💡</span>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          )}
        </form>
      </div>
    </Card>
  )
}

export default ChatBox