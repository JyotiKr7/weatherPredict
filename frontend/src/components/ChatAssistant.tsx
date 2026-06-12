import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialMessages = [
  { sender: 'ai', text: 'Hello! I am your ClimateSense AI. How can I help you analyze the weather today?' }
];

const generateSmartResponse = (input: string) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello there! I'm ready to analyze climate data for you. Which city or region would you like to check?";
  }
  
  if (lowerInput.includes('patna')) {
    return "Analyzing Patna... Currently, the temperature is around 32°C with high humidity. There's a 20% chance of localized thunderstorms this evening. AQI is at 115 (Moderate).";
  }

  if (lowerInput.includes('temperature') || lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('hot')) {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
    const matchedCity = cities.find(city => lowerInput.includes(city.toLowerCase()));
    
    if (matchedCity) {
      const temp = Math.floor(Math.random() * 15) + 25;
      return `The current temperature in ${matchedCity} is ${temp}°C. Satellite telemetry indicates stable weather patterns for the next 6 hours.`;
    }
    return "I can fetch the precise weather telemetry for you. Could you please specify which city you are interested in?";
  }
  
  if (lowerInput.includes('aqi') || lowerInput.includes('pollution') || lowerInput.includes('air quality')) {
    return "The Air Quality Index is highly dependent on local emissions and wind patterns. Would you like me to pull the latest sensor data for Delhi or Mumbai?";
  }

  if (lowerInput.includes('globe') || lowerInput.includes('map') || lowerInput.includes('3d')) {
    return "Our interactive 3D globe is currently rendering real-time wind and temperature data! You can view it by clicking the 'Live Map' tab in the sidebar.";
  }
  
  if (lowerInput.includes('crop') || lowerInput.includes('agriculture') || lowerInput.includes('farm')) {
    return "Our ML models indicate that the recent rainfall patterns are highly favorable for crop yields in the northern plains. Check the 'ML Insights' tab for detailed yield predictions.";
  }

  if (lowerInput.match(/^\d+$/)) {
    return `I received the numerical input "${input}". Are you looking up a specific sensor ID, or querying a temperature threshold?`;
  }

  return `I have processed your query regarding "${input}". My neural network is currently analyzing the relevant meteorological parameters. Is there a specific data point you need?`;
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startRecording = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice commands are not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    // Generate contextual AI response
    setTimeout(() => {
      const contextualResponse = generateSmartResponse(input);
      setMessages(prev => [...prev, { sender: 'ai', text: contextualResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl mb-4 overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <Bot size={24} />
                <div>
                  <h3 className="font-bold">ClimateSense AI</h3>
                  <p className="text-xs text-indigo-200">Online & ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-border shrink-0">
              <div className="flex gap-2 relative">
                <button
                  onClick={startRecording}
                  className={`shrink-0 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                  title={isRecording ? "Recording..." : "Voice Command"}
                >
                  <Mic size={20} className={isRecording ? 'animate-bounce' : ''} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "Ask about the weather..."}
                  className={`flex-1 border-none rounded-xl px-4 py-2 focus:ring-2 outline-none transition-colors ${
                    isRecording ? 'bg-red-50 text-red-900 placeholder:text-red-400 focus:ring-red-500' : 'bg-gray-100 focus:ring-indigo-500'
                  }`}
                />
                <button 
                  onClick={handleSend}
                  className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatAssistant;
