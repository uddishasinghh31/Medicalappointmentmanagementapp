import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Heart, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface HealthChatbotProps {
  onScheduleAppointment?: () => void;
  onAddMedicine?: () => void;
  onViewDocuments?: () => void;
}

export function HealthChatbot({ 
  onScheduleAppointment, 
  onAddMedicine, 
  onViewDocuments 
}: HealthChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Health Sathi assistant. I'm here to help you manage your appointments, medications, and answer health-related questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-defined responses for common health queries
  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule')) {
      return "I can help you schedule an appointment! You can add a new appointment by clicking on the 'Appointments' tab and then 'Add New Appointment'. Would you like me to guide you through the process?";
    }
    
    if (message.includes('medicine') || message.includes('medication') || message.includes('pill')) {
      return "I can help you manage your medications! You can add new medicines, set reminders, and track your dosages in the 'Medicines' section. Remember to always take medications as prescribed by your doctor.";
    }
    
    if (message.includes('document') || message.includes('report') || message.includes('prescription')) {
      return "You can store and organize all your medical documents in the 'Documents' section. This includes lab reports, prescriptions, and medical records. Would you like me to show you how to add a new document?";
    }
    
    if (message.includes('emergency') || message.includes('urgent')) {
      return "For medical emergencies, please call emergency services immediately (911 in the US). Your emergency contact information is stored in your profile. For urgent but non-emergency concerns, contact your doctor directly.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm here to help you with:\n• Scheduling appointments\n• Managing medications\n• Organizing medical documents\n• General health guidance\n\nWhat would you like assistance with?";
    }
    
    if (message.includes('blood pressure') || message.includes('bp')) {
      return "It's important to monitor your blood pressure regularly. Normal blood pressure is usually below 120/80 mmHg. Make sure to record your readings and share them with your doctor during appointments.";
    }
    
    if (message.includes('diabetes') || message.includes('sugar') || message.includes('glucose')) {
      return "For diabetes management, remember to:\n• Take medications as prescribed\n• Monitor blood sugar levels\n• Maintain a healthy diet\n• Exercise regularly\n• Keep regular doctor appointments\n\nAlways follow your doctor's specific advice.";
    }
    
    if (message.includes('heart') || message.includes('cardiac')) {
      return "Heart health is crucial! Remember to:\n• Take prescribed heart medications\n• Follow a heart-healthy diet\n• Exercise as recommended by your doctor\n• Monitor symptoms\n• Keep regular cardiology appointments";
    }
    
    if (message.includes('reminder') || message.includes('alarm')) {
      return "I can help you set up medication reminders! In the 'Medicines' section, you can set specific times for each medication. This helps ensure you never miss a dose.";
    }
    
    // Default response
    return "I understand you're asking about health-related topics. While I can provide general guidance, please always consult with your healthcare provider for specific medical advice. Is there something specific about appointments, medications, or documents I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
          }}
        >
          <MessageCircle size={28} />
          
          {/* Pulse indicator */}
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            backgroundColor: '#fbbf24',
            borderRadius: '50%',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}></div>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '600px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Health Assistant
            </h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
              Always here to help
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            {message.sender === 'bot' && (
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Heart size={16} fill="white" color="white" />
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: message.sender === 'user' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(16, 185, 129, 0.1)',
              color: message.sender === 'user' ? 'white' : '#374151',
              whiteSpace: 'pre-line',
              fontSize: '16px',
              lineHeight: '1.5',
              border: message.sender === 'bot' ? '1px solid rgba(16, 185, 129, 0.2)' : 'none'
            }}>
              {message.text}
            </div>

            {message.sender === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '16px',
                color: 'white',
                fontWeight: '600'
              }}>
                U
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} color="white" style={{ animation: 'pulse 1s infinite' }} />
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1s infinite 0.3s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1s infinite 0.6s'
              }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
        backgroundColor: 'rgba(248, 250, 252, 0.8)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about appointments, medications, or health tips..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backgroundColor: 'white',
              fontSize: '16px',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '48px',
              maxHeight: '120px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            rows={1}
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: inputText.trim() && !isTyping 
                ? 'linear-gradient(135deg, #10b981, #14b8a6)' 
                : '#e5e7eb',
              color: inputText.trim() && !isTyping ? 'white' : '#9ca3af',
              cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}