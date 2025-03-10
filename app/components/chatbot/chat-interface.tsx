"use client";

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/auth-context';
import { Send, Loader2, Home, Truck, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  properties?: any[];
  transportation?: any[];
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you find properties and transportation services. What are you looking for today?',
      timestamp: new Date().toISOString(),
      suggestions: [
        'I need a 2-bedroom apartment',
        'Show me houses under $400,000',
        'I need a moving service',
        'What transportation options are available?'
      ]
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Set up a polling mechanism to check for new messages
  useEffect(() => {
    if (!conversationId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('messages')
          .eq('id', conversationId)
          .single();

        if (error) {
          console.error('Error polling for messages:', error);
          return;
        }

        if (data && data.messages) {
          // Check if we have new messages
          const currentMessageIds = messages.map(m => m.id).filter(Boolean);
          const newMessages = data.messages.filter((m: Message) => 
            m.id && !currentMessageIds.includes(m.id)
          );

          if (newMessages.length > 0) {
            setMessages(prev => [...prev, ...newMessages]);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error polling for messages:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [conversationId, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: user?.id,
          conversationId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Store the conversation ID for future messages
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Only add the assistant's message if it's not a "processing" message
      // The real response will come through the polling mechanism
      if (!data.text.includes("processing your request")) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.text,
          timestamp: data.timestamp,
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Focus the input field after setting the suggestion
    inputRef.current?.focus();
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] w-full max-w-2xl mx-auto border border-border rounded-lg overflow-hidden bg-card shadow-sm">
      <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
        <h2 className="text-base sm:text-lg font-semibold">Property & Transportation Assistant</h2>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
                role={message.role === 'assistant' ? 'status' : undefined}
              >
                <p className="text-sm break-words">{message.content}</p>
                
                {/* Property results */}
                {message.properties && message.properties.length > 0 && (
                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    {message.properties.map((property) => (
                      <Link 
                        key={property.id} 
                        href={`/routes/public/properties/${property.id}`}
                        className="block bg-background rounded-md overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <div className="flex">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                            <Image
                              src={property.images[0] || '/placeholder-property.jpg'}
                              alt={property.title}
                              fill
                              sizes="(max-width: 640px) 64px, 80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-2 flex-1 overflow-hidden">
                            <h4 className="font-medium text-xs sm:text-sm truncate">{property.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                            <div className="flex items-center mt-1 text-xs">
                              <Home className="h-3 w-3 mr-1" />
                              <span className="mr-2">{property.property_type}</span>
                              <span className="font-medium text-primary">${property.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href="/routes/public/properties" 
                      className="text-xs text-primary hover:underline flex items-center justify-center mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    >
                      View all properties
                    </Link>
                  </div>
                )}
                
                {/* Transportation results */}
                {message.transportation && message.transportation.length > 0 && (
                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    {message.transportation.map((service) => (
                      <Link 
                        key={service.id} 
                        href={`/routes/public/transportation/${service.id}`}
                        className="block bg-background rounded-md overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <div className="flex">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                            <Image
                              src={service.images[0] || '/placeholder-transportation.jpg'}
                              alt={service.name}
                              fill
                              sizes="(max-width: 640px) 64px, 80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-2 flex-1 overflow-hidden">
                            <h4 className="font-medium text-xs sm:text-sm truncate">{service.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{service.location}</p>
                            <div className="flex items-center mt-1 text-xs">
                              <Truck className="h-3 w-3 mr-1" />
                              <span className="mr-2">{service.service_type.replace('_', ' ')}</span>
                              <span className="font-medium text-primary capitalize">{service.price_range} price</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href="/routes/public/transportation" 
                      className="text-xs text-primary hover:underline flex items-center justify-center mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    >
                      View all transportation services
                    </Link>
                  </div>
                )}
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-background hover:bg-muted/50 rounded-full px-3 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-2 items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {user ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Signed in as {user.email}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            <Link 
              href="/routes/auth/login" 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            >
              Sign in
            </Link> to save your chat history
          </p>
        )}
      </form>
    </div>
  );
} 