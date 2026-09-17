import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Send, User, Bot, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex flex-row items-end">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mr-3 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm glass-card flex items-center space-x-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: `typing-dot 1s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  </div>
);

const MessageBubble = ({ msg }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`flex max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser ? 'bg-slate-700 ml-2.5' : 'bg-gradient-to-br from-blue-600 to-blue-700 mr-2.5 shadow-md'
        }`}>
          {isUser ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        <div className="relative">
          <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-sm' 
              : 'glass-card text-slate-200 rounded-bl-sm'
          }`}>
            {msg.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i !== msg.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-5 right-1 text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px]"
            >
              {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hello! I\'m your Medical AI Assistant powered by Gemini. How can I help you today? 🩺' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = res.ok ? await res.json() : null;
      setMessages(prev => [...prev, { role: 'model', content: data?.response || 'Sorry, I encountered an error.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: 'Network error. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', content: 'Chat cleared. How can I help you? 🩺' }]);
  };

  const suggestions = ['What is a healthy cholesterol level?', 'Explain blood sugar levels', 'Tips for lowering blood pressure'];

  return (
    <div className="flex h-screen bg-slate-950 font-inter text-slate-300">
      <Sidebar />
      <main className="flex-1 ml-72 flex flex-col h-full">
        
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800/40 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-outfit text-white">AI Assistant</h1>
              <p className="text-slate-600 text-xs">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={clearChat} className="text-xs text-slate-600 hover:text-slate-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/[0.08] px-3 py-1.5 rounded-full border border-emerald-500/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.map((msg, idx) => <MessageBubble key={idx} msg={msg} />)}
          {isLoading && <TypingIndicator />}
          
          {/* Suggestions */}
          {messages.length === 1 && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="text-xs glass-light px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-5 border-t border-slate-800/40 bg-slate-950">
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your health..." 
              className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-5 pr-14 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-25"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;
