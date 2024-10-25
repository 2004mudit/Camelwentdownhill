import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Card, CardContent } from './ui/Card'; // Adjust the path as needed
import { Button } from './ui/Button'; // Adjust the path as needed
import axios from 'axios'; // Import axios

const ChatMessage = ({ message, isBot }) => (
  <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
    <div
      className={`${
        isBot 
          ? 'bg-gray-800 text-black rounded-br-xl' 
          : 'bg-blue-500 text-black rounded-bl-xl'
      } max-w-[80%] rounded-t-xl px-4 py-2 ${isBot ? 'rounded-bl-xl' : 'rounded-br-xl'}`}
    >
      {isBot ? (
        <div dangerouslySetInnerHTML={{ __html: message }} /> // Use dangerouslySetInnerHTML for structured content
      ) : (
        message
      )}
    </div>
  </div>
);

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your coding assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    setIsLoading(true);
    
    try {
      // Make an API call to the Mistral model
      const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: inputMessage }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer qIvpHcAmhpIGpbR5TCpvMSs0xR5jxRLd`
        }
      });

      const aiResponse = response.data.choices[0].message.content || "I'm sorry, I couldn't process your request.";
      
      // Format the response for better readability
      const formattedResponse = aiResponse.replace(/\n/g, '<br/>'); // Replace newlines with <br/> for HTML rendering

      setMessages(prev => [...prev, { text: formattedResponse, isBot: true }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        isBot: true 
      }]);
    }
    
    setIsLoading(false);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ 
      text: "Hi! I'm your coding assistant. How can I help you today?", 
      isBot: true 
    }]);
  };

  return (
    <div className="fixed bottom-4 right-20 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`bg-gray-900 text-black shadow-xl transition-all duration-200 ${
          isExpanded ? 'w-[500px] h-[600px]' : 'w-[350px] h-[500px]'
        }`}>
          {/* Header */}
          <div className="p-3 bg-gray-800 rounded-t-lg flex justify-between items-center text-black">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Coding Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearChat}
                className="h-8 w-8 hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 hover:bg-gray-700"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <CardContent className="p-4 h-[calc(100%-130px)] overflow-y-auto text-black">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message.text} 
                isBot={message.isBot} 
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-800 text-black rounded-xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding..."
                className="flex-1 bg-gray-800 text-black rounded-lg p-2 resize-none h-10 min-h-[40px] max-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ lineHeight: '20px' }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIChatWidget;
