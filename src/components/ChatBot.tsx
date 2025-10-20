import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, Send, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice input failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: ChatMessage = {
        sender: 'ai',
        text: '👋 Hello! I\'m Woo, your MoStar Intelligence Grid interface. How can I assist you today?',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('🎤 Listening...');
      } catch (error) {
        console.error('Speech recognition start error:', error);
        toast.error('Could not start voice input');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: newMessage,
      });

      // Call mostar-chat edge function with streaming
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mostar-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit reached. Please wait a moment.');
          throw new Error('Rate limit exceeded');
        }
        if (response.status === 402) {
          toast.error('AI usage limit reached. Please contact support.');
          throw new Error('Payment required');
        }
        throw new Error('Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let aiResponseText = '';

      if (!reader) throw new Error('No response body');

      // Add initial AI message placeholder
      const aiMessage: ChatMessage = {
        sender: 'ai',
        text: '',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              aiResponseText += content;
              // Update the last AI message
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: aiResponseText,
                };
                return updated;
              });
            }
          } catch {
            // Incomplete JSON, put back
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Save to AI memory
      try {
        await (supabase as any).from('ai_memory').insert({
          agent: 'woo',
          interaction_type: 'chat',
          content: {
            user: newMessage,
            assistant: aiResponseText,
          },
        });
      } catch (error) {
        console.error('Failed to save to AI memory:', error);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: ChatMessage = {
        sender: 'ai',
        text: 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-mostar-blue flex items-center justify-center shadow-neon-blue transition-transform duration-300 hover:scale-110 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open MoStar AI"
      >
        <MessageSquare className="text-white h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-0 right-0 z-50 w-full sm:w-96 h-[500px] sm:h-[600px] rounded-t-lg sm:rounded-lg glassmorphism shadow-lg flex flex-col border border-white/10 transition-all duration-300 transform ${
        isOpen ? 'translate-y-0 opacity-100 sm:mr-6 sm:mb-6' : 'translate-y-full opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-mostar-blue/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-mostar-blue to-mostar-cyan flex items-center justify-center">
              <span className="font-display font-bold text-sm text-white">W</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-white">Woo AI</h3>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-mostar-green animate-pulse"></span>
                <span className="text-white/50 text-xs ml-2">Intelligence Interface</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.sender === 'user' 
                  ? 'bg-mostar-blue/20 border border-mostar-blue/30 text-white' 
                  : 'bg-black/30 border border-white/10 text-white'
              }`}>
                <div className="flex flex-col">
                  <span className={`text-xs ${message.sender === 'user' ? 'text-mostar-cyan/70' : 'text-mostar-light-blue/70'} mb-1`}>
                    {message.sender === 'user' ? 'You' : 'Woo AI'} • {formatTimestamp(message.timestamp)}
                  </span>
                  <span className="whitespace-pre-wrap">{message.text}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-black/30 border border-white/10 text-white">
                <div className="text-xs text-mostar-light-blue/70 mb-1">
                  Woo AI is thinking...
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mostar-light-blue animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-mostar-light-blue animate-pulse animate-delay-300"></div>
                  <div className="w-2 h-2 rounded-full bg-mostar-light-blue animate-pulse animate-delay-500"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleListening} 
              className={`p-2 rounded-full ${isListening ? 
                'text-mostar-green bg-mostar-green/10' : 
                'text-white/70 hover:text-mostar-cyan hover:bg-mostar-cyan/10'} 
                transition-colors`}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <input
              type="text"
              placeholder="Ask Woo anything..."
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mostar-blue/50"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            
            <button 
              onClick={handleSendMessage}
              className={`p-2 rounded-full ${
                newMessage.trim() 
                  ? 'text-mostar-light-blue hover:bg-mostar-blue/10' 
                  : 'text-white/30 cursor-not-allowed'
              } transition-colors`}
              disabled={!newMessage.trim()}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="text-xs text-white/40">MoStar Intelligence Grid</div>
            <div className="flex space-x-2">
              <button className="text-xs text-white/40 hover:text-mostar-light-blue transition-colors">
                Text
              </button>
              <span className="text-white/40">|</span>
              <button onClick={toggleListening} className={`text-xs ${isListening ? 'text-mostar-green' : 'text-white/40 hover:text-mostar-light-blue'} transition-colors`}>
                Voice
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
