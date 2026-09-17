import React, { useState, useRef, useEffect } from 'react';
import { mockLLMStream, mockRetrieveContext } from '../utils/llmService';
import RAGContextPanel from './RAGContextPanel';

const ChatInterface = ({ documentData }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hello! I have analyzed your medical report. What specific questions do you have about it?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [retrievedContext, setRetrievedContext] = useState([]);
  const [isRetrieving, setIsRetrieving] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsRetrieving(true);
    
    // Simulate RAG Retrieval
    const context = await mockRetrieveContext(userMessage.content, documentData);
    setRetrievedContext(context);
    setIsRetrieving(false);
    
    // Setup AI response message
    setIsTyping(true);
    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: '' }]);

    // Stream LLM response
    await mockLLMStream(
      userMessage.content,
      context,
      (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg
        ));
      },
      () => {
        setIsTyping(false);
      }
    );
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '600px', width: '100%' }}>
      {/* Chat Area */}
      <div className="glass-panel" style={{
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--surface-border)',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-color), var(--success))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>AI</div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Medical AI Assistant</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>● Online</span>
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          paddingRight: '0.5rem',
          marginBottom: '1rem'
        }}>
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in" style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: msg.role === 'user' ? 'var(--surface-color-solid)' : 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1px solid ${msg.role === 'user' ? 'var(--surface-border)' : 'var(--accent-color)'}`
              }}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'var(--surface-border)' : 'rgba(59, 130, 246, 0.1)',
                padding: '1rem',
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                maxWidth: '80%',
                lineHeight: '1.6'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="animate-fade-in" style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid var(--accent-color)'
                }}></div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '1rem',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <span style={{ animation: 'pulse-glow 1.5s infinite', width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }}></span>
                  <span style={{ animation: 'pulse-glow 1.5s infinite 0.2s', width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }}></span>
                  <span style={{ animation: 'pulse-glow 1.5s infinite 0.4s', width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }}></span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} style={{
          display: 'flex',
          gap: '1rem',
          background: 'rgba(0,0,0,0.2)',
          padding: '0.5rem',
          borderRadius: '16px',
          border: '1px solid var(--surface-border)'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your report..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              padding: '0.5rem 1rem',
              fontSize: '1rem'
            }}
            disabled={isTyping || isRetrieving}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '0.5rem 1.5rem', borderRadius: '12px' }}
            disabled={isTyping || isRetrieving}
          >
            Send
          </button>
        </form>
      </div>

      {/* RAG Context Area */}
      <div className="glass-panel" style={{
        flex: 1,
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        <RAGContextPanel contextItems={retrievedContext} isRetrieving={isRetrieving} />
      </div>
    </div>
  );
};

export default ChatInterface;
