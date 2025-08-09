import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useState } from 'react'

const ChatBox = () => {
  // const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleMessageChange = (message) => {
    setMessage(message);
  };

  const handleSendMessage = () => {
    // Logic to send the message
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <Card className="h-[75vh] w-full p-4">
      <div>
        <h2 className="text-lg font-semibold mb-4 border-b">Chat with Team</h2>
      </div>
      <ScrollArea className="h-[60vh] w-full p-4 flex gap-4 flex-col">
        <div>
          <div className="flex gap-2 mb-2">
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="space-y-2 py-2 px-5 border rounded-ss-2xl rounded-ee-2xl bg-gray-100">
              <p className="text-sm font-semibold">User Name</p>
              <p className="text-sm">Hello, how is the project going?</p>
            </div>
          </div>
          <div className="flex items-start gap-4 mb-4 justify-end">
            <div className="bg-blue-100 p-2 rounded-md max-w-[70%]">
              <p className="text-sm">It's going well, we are on track!</p>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
          </div>
          {/* Add more messages as needed */}
        </div>
        </ScrollArea>
      <div className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Type your message..."
          className="w-[80%] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSendMessage} className="inline-block m-2 w-[14%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none">
          Send
        </button>
      </div>
    </Card>
  )
}

export default ChatBox