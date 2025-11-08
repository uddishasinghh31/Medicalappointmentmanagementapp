import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Heart, Sparkles, Stethoscope, Activity, Pill, Calendar, FileText, Settings, Mic, MicOff } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'action' | 'suggestion';
  actions?: Array<{ label: string; action: () => void }>;
}

interface HealthChatbotProps {
  onScheduleAppointment?: () => void;
  onAddMedicine?: () => void;
  onViewDocuments?: () => void;
}

export function EnhancedHealthChatbot({ 
  onScheduleAppointment, 
  onAddMedicine, 
  onViewDocuments 
}: HealthChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Nurse Sarah, your personal Health Sathi assistant. I'm here 24/7 to help you manage your health journey. I can assist with appointments, medications, symptoms, and provide health guidance. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI-like response system with context awareness
  const getIntelligentResponse = (userMessage: string, context: string[]): Message => {
    const message = userMessage.toLowerCase();
    const hasContext = context.length > 0;
    const recentContext = context.slice(-3).join(' ').toLowerCase();
    
    // Symptom checker responses
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache')) {
      if (message.includes('head') || message.includes('headache')) {
        return {
          id: Date.now() + 1,
          text: "I understand you're experiencing headache pain. Here are some immediate steps:\n\n🔍 **Assessment:**\n• Rate your pain (1-10 scale)\n• Duration and frequency\n• Any triggers you've noticed\n\n💡 **Immediate Relief:**\n• Rest in a quiet, dark room\n• Apply cold/warm compress\n• Stay hydrated\n• Gentle neck stretches\n\n⚠️ **See a doctor if:**\n• Severe sudden headache\n• Accompanied by fever, vision changes\n• Persistent for more than 72 hours\n\nWould you like me to help you schedule an appointment or track this symptom?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'action',
          actions: [
            { label: 'Schedule Doctor Visit', action: () => onScheduleAppointment?.() },
            { label: 'Track Symptoms', action: () => onViewDocuments?.() }
          ]
        };
      }
      
      if (message.includes('chest')) {
        return {
          id: Date.now() + 1,
          text: "⚠️ **CHEST PAIN ALERT** ⚠️\n\nChest pain can be serious. If you're experiencing:\n• Crushing or squeezing pain\n• Pain radiating to arm, neck, jaw\n• Shortness of breath\n• Sweating or nausea\n\n🚨 **CALL EMERGENCY SERVICES IMMEDIATELY (911)**\n\nFor mild discomfort:\n• Sit upright and rest\n• Loosen tight clothing\n• Take slow, deep breaths\n\nI strongly recommend seeking immediate medical attention for any chest pain.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'action',
          actions: [
            { label: 'Emergency Contacts', action: () => alert('Emergency: 911\nPoison Control: 1-800-222-1222') }
          ]
        };
      }
      
      return {
        id: Date.now() + 1,
        text: "I'm sorry you're experiencing pain. Let me help you assess this:\n\n📋 **Pain Assessment:**\n• Where exactly is the pain?\n• How would you rate it (1-10)?\n• What does it feel like? (sharp, dull, throbbing)\n• When did it start?\n• What makes it better/worse?\n\n💊 **General Pain Management:**\n• Rest the affected area\n• Apply ice (first 24-48 hrs) or heat\n• Over-the-counter pain relievers (as directed)\n• Gentle movement if tolerated\n\nWould you like help documenting this or scheduling a medical consultation?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Log Symptoms', action: () => onViewDocuments?.() },
          { label: 'Find Doctor', action: () => onScheduleAppointment?.() }
        ]
      };
    }

    // Medication management
    if (message.includes('medicine') || message.includes('medication') || message.includes('pill') || message.includes('dose')) {
      if (message.includes('forgot') || message.includes('missed')) {
        return {
          id: Date.now() + 1,
          text: "Don't worry, missed doses happen! Here's what to do:\n\n⏰ **Missed Dose Guidelines:**\n• If it's within 2 hours of normal time → Take it now\n• If it's almost time for next dose → Skip missed dose\n• Never double dose unless specifically instructed\n\n📱 **Prevention Tips:**\n• Set multiple daily alarms\n• Use pill organizers\n• Link to daily routines (meals, brushing teeth)\n• Consider medication reminder apps\n\nWould you like me to help you set up better medication reminders?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'action',
          actions: [
            { label: 'Set Up Reminders', action: () => onAddMedicine?.() },
            { label: 'Medication Schedule', action: () => onAddMedicine?.() }
          ]
        };
      }
      
      if (message.includes('side effect') || message.includes('reaction')) {
        return {
          id: Date.now() + 1,
          text: "Medication side effects can be concerning. Let me help:\n\n🔍 **Common Side Effects:**\n• Nausea, dizziness, fatigue\n• Usually improve after a few days\n• Take with food if stomach upset\n\n⚠️ **Serious Reactions (Seek immediate care):**\n• Difficulty breathing or swallowing\n• Severe rash, hives, or swelling\n• Rapid heartbeat or chest pain\n• Severe dizziness or fainting\n\n📞 **Next Steps:**\n• Document the side effect details\n• Contact your prescribing doctor\n• Don't stop medication without medical advice\n\nWould you like help documenting this side effect?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'action',
          actions: [
            { label: 'Document Side Effect', action: () => onViewDocuments?.() },
            { label: 'Contact Doctor', action: () => onScheduleAppointment?.() }
          ]
        };
      }
      
      return {
        id: Date.now() + 1,
        text: "I'm here to help with all your medication needs! 💊\n\n🔧 **Medication Management:**\n• Add new prescriptions and set reminders\n• Track doses and timing\n• Monitor for side effects\n• Organize refill schedules\n\n💡 **Pro Tips:**\n• Take medications at the same time daily\n• Keep an updated medication list\n• Store medications properly\n• Check expiration dates regularly\n\nWhat specific medication help do you need today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Add New Medicine', action: () => onAddMedicine?.() },
          { label: 'View My Medicines', action: () => onAddMedicine?.() }
        ]
      };
    }

    // Appointment scheduling
    if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule') || message.includes('visit')) {
      if (hasContext && recentContext.includes('pain') || recentContext.includes('symptom')) {
        return {
          id: Date.now() + 1,
          text: "Based on our conversation about your symptoms, I recommend scheduling an appointment. Here are your options:\n\n🏥 **Appointment Types:**\n• **Urgent Care:** Same-day for non-emergency concerns\n• **Primary Care:** Routine check-ups and ongoing care\n• **Specialist:** For specific conditions (referral may be needed)\n• **Telemedicine:** Virtual consultation from home\n\n📋 **Before Your Visit:**\n• List all symptoms and when they started\n• Bring current medications\n• Note any questions you want to ask\n• Bring insurance cards and ID\n\nWould you like help preparing for your appointment?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'action',
          actions: [
            { label: 'Schedule Now', action: () => onScheduleAppointment?.() },
            { label: 'Prep Checklist', action: () => onViewDocuments?.() }
          ]
        };
      }
      
      return {
        id: Date.now() + 1,
        text: "I'd be happy to help you schedule an appointment! 📅\n\n🔍 **What type of visit do you need?**\n• Annual physical/check-up\n• Follow-up for existing condition\n• New health concern\n• Specialist consultation\n• Preventive screening\n\n⏰ **Scheduling Tips:**\n• Morning appointments are often available\n• Allow extra time for new patient visits\n• Confirm insurance coverage\n• Ask about preparation requirements\n\nLet me guide you through scheduling your appointment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Book Appointment', action: () => onScheduleAppointment?.() },
          { label: 'Find Specialists', action: () => onScheduleAppointment?.() }
        ]
      };
    }

    // Health monitoring and vitals
    if (message.includes('blood pressure') || message.includes('bp') || message.includes('pressure')) {
      return {
        id: Date.now() + 1,
        text: "Blood pressure monitoring is crucial for heart health! 🫀\n\n📊 **Normal Ranges:**\n• **Optimal:** Less than 120/80 mmHg\n• **Elevated:** 120-129 (systolic) and less than 80 (diastolic)\n• **High Stage 1:** 130-139/80-89 mmHg\n• **High Stage 2:** 140/90 mmHg or higher\n\n📝 **Monitoring Tips:**\n• Measure at the same time daily\n• Rest 5 minutes before measuring\n• Avoid caffeine 30 minutes prior\n• Use proper cuff size\n• Record readings in a log\n\n🔍 **Lifestyle Factors:**\n• Regular exercise\n• Limit sodium intake\n• Maintain healthy weight\n• Manage stress\n• Limit alcohol\n\nWould you like help tracking your blood pressure readings?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Start BP Log', action: () => onViewDocuments?.() },
          { label: 'Schedule Check-up', action: () => onScheduleAppointment?.() }
        ]
      };
    }

    // Emergency situations
    if (message.includes('emergency') || message.includes('urgent') || message.includes('911')) {
      return {
        id: Date.now() + 1,
        text: "🚨 **EMERGENCY GUIDANCE** 🚨\n\n**Call 911 immediately for:**\n• Chest pain or pressure\n• Difficulty breathing\n• Severe bleeding\n• Loss of consciousness\n• Severe allergic reaction\n• Stroke symptoms (F.A.S.T.)\n• Severe trauma or injury\n\n**Other Emergency Numbers:**\n• Poison Control: 1-800-222-1222\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention: 988\n\n**Your Emergency Info:**\nCheck your profile for emergency contacts and medical information.\n\n*If this is a medical emergency, please call 911 now.*",
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Call 911', action: () => window.open('tel:911') },
          { label: 'Emergency Info', action: () => alert('Emergency contacts are in your profile') }
        ]
      };
    }

    // Wellness and prevention
    if (message.includes('exercise') || message.includes('fitness') || message.includes('workout')) {
      return {
        id: Date.now() + 1,
        text: "Great question about fitness! Regular exercise is one of the best things for your health. 💪\n\n🏃‍♀️ **Exercise Guidelines:**\n• **Cardio:** 150 min moderate or 75 min vigorous weekly\n• **Strength:** 2+ days per week, all major muscle groups\n• **Flexibility:** Daily stretching and mobility work\n\n👥 **Getting Started:**\n• Start slowly and gradually increase\n• Choose activities you enjoy\n• Set realistic, achievable goals\n• Listen to your body\n• Consider working with a trainer\n\n⚠️ **Safety First:**\n• Warm up before, cool down after\n• Stay hydrated\n• Wear appropriate gear\n• Stop if you feel pain or dizziness\n\nConsult your doctor before starting new exercise programs, especially if you have health conditions.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
      const timeOfDay = new Date().getHours();
      let greeting = 'Hello';
      if (timeOfDay < 12) greeting = 'Good morning';
      else if (timeOfDay < 17) greeting = 'Good afternoon';
      else greeting = 'Good evening';
      
      return {
        id: Date.now() + 1,
        text: `${greeting}! It's wonderful to hear from you. 😊\n\nI'm Nurse Sarah, your dedicated Health Sathi assistant. I'm here to help you with:\n\n🏥 **Healthcare Management:**\n• Schedule and track appointments\n• Manage medications and reminders\n• Store and organize medical documents\n• Monitor symptoms and vitals\n\n💡 **Health Guidance:**\n• Answer health-related questions\n• Provide wellness tips and advice\n• Help with emergency situations\n• Connect you with appropriate care\n\nWhat can I help you with today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action',
        actions: [
          { label: 'Schedule Appointment', action: () => onScheduleAppointment?.() },
          { label: 'Manage Medicines', action: () => onAddMedicine?.() },
          { label: 'Health Records', action: () => onViewDocuments?.() }
        ]
      };
    }

    // Default intelligent response with personalization
    const responses = [
      `I understand you're asking about health-related topics. As your personal health assistant, I'm here to provide guidance and support. Let me know what specific area you'd like help with - whether it's symptoms, medications, appointments, or general wellness advice.`,
      
      `That's an interesting health question! While I can provide general guidance and help you navigate your healthcare journey, I always recommend consulting with your healthcare provider for personalized medical advice. How can I assist you in preparing for that conversation or managing your health in the meantime?`,
      
      `I'm here to help you take charge of your health! Whether you need to track symptoms, manage medications, schedule appointments, or just want reliable health information, I've got you covered. What would you like to focus on today?`
    ];
    
    return {
      id: Date.now() + 1,
      text: responses[Math.floor(Math.random() * responses.length)] + "\n\n🔧 **I can help you with:**\n• Symptom assessment and tracking\n• Medication management\n• Appointment scheduling\n• Health document organization\n• Emergency guidance\n• Wellness tips and advice",
      sender: 'bot',
      timestamp: new Date(),
      type: 'action',
      actions: [
        { label: 'Track Symptoms', action: () => onViewDocuments?.() },
        { label: 'Manage Medications', action: () => onAddMedicine?.() },
        { label: 'Schedule Care', action: () => onScheduleAppointment?.() }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const newContext = [...conversationContext, inputText];
    setConversationContext(newContext);
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Enhanced AI response with context
    setTimeout(() => {
      const botResponse = getIntelligentResponse(inputText, newContext);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1500); // Variable response time for more natural feel
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      // Simulate voice recognition
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText("I have a headache"); // Simulated voice input
      }, 3000);
    } else {
      setIsListening(false);
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
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '3px solid white',
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
            cursor: 'pointer',
            boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'pulse 2s infinite',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 18px 40px rgba(16, 185, 129, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)';
          }}
        >
          {/* Nurse Image */}
          <img 
            src="https://images.unsplash.com/photo-1549382245-11fba774ac5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG51cnNlJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTczMDc5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Nurse Sarah"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
          
          {/* Status indicator */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '20px',
            height: '20px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: '3px solid white',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}></div>
          
          {/* Stethoscope icon overlay */}
          <div style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <Stethoscope size={12} color="#10b981" />
          </div>
        </button>
        
        {/* Floating tooltip */}
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: '0',
          marginBottom: '12px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}>
          Chat with Nurse Sarah
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '420px',
      height: '650px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Enhanced Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          borderRadius: '20px 20px 0 0'
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1549382245-11fba774ac5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG51cnNlJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTczMDc5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Nurse Sarah"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              border: '2px solid white'
            }}></div>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Nurse Sarah
            </h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} />
              AI Health Assistant • Online
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 1 }}>
          <button
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'rgba(248, 250, 252, 0.5)'
      }}>
        {messages.map((message) => (
          <div key={message.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              {message.sender === 'bot' && (
                <img 
                  src="https://images.unsplash.com/photo-1549382245-11fba774ac5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG51cnNlJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTczMDc5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Nurse Sarah"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    objectFit: 'cover',
                    border: '2px solid #10b981'
                  }}
                />
              )}
              
              <div style={{
                maxWidth: '75%',
                padding: '14px 18px',
                borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                backgroundColor: message.sender === 'user' 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'white',
                color: message.sender === 'user' ? 'white' : '#374151',
                whiteSpace: 'pre-line',
                fontSize: '15px',
                lineHeight: '1.5',
                boxShadow: message.sender === 'bot' 
                  ? '0 4px 12px rgba(0,0,0,0.1)' 
                  : '0 4px 12px rgba(59, 130, 246, 0.3)',
                border: message.sender === 'bot' ? '1px solid rgba(16, 185, 129, 0.1)' : 'none'
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
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '600',
                  border: '2px solid rgba(59, 130, 246, 0.3)'
                }}>
                  You
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            {message.actions && (
              <div style={{
                marginTop: '12px',
                marginLeft: message.sender === 'bot' ? '40px' : '0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {message.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: '#10b981',
                      border: '2px solid #10b981',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#10b981';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
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
            <img 
              src="https://images.unsplash.com/photo-1549382245-11fba774ac5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG51cnNlJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTczMDc5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Nurse Sarah"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #10b981'
              }}
            />
            <div style={{
              padding: '14px 18px',
              borderRadius: '20px 20px 20px 4px',
              backgroundColor: 'white',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1.4s infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1.4s infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 1.4s infinite 0.4s'
              }}></div>
              <span style={{
                fontSize: '12px',
                color: '#6b7280',
                marginLeft: '8px'
              }}>
                Nurse Sarah is typing...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
        backgroundColor: 'white'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Ask me anything about your health..."}
              style={{
                width: '100%',
                padding: '12px 50px 12px 16px',
                borderRadius: '12px',
                border: `2px solid ${isListening ? '#fbbf24' : 'rgba(16, 185, 129, 0.3)'}`,
                backgroundColor: isListening ? '#fffbeb' : 'white',
                fontSize: '15px',
                lineHeight: '1.5',
                resize: 'none',
                minHeight: '48px',
                maxHeight: '120px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              rows={1}
              disabled={isListening}
              onFocus={(e) => {
                if (!isListening) e.target.style.borderColor = '#10b981';
              }}
              onBlur={(e) => {
                if (!isListening) e.target.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              }}
            />
            
            {/* Voice input button */}
            <button
              onClick={toggleVoiceInput}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isListening ? '#fbbf24' : 'transparent',
                color: isListening ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isListening) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#10b981';
                }
              }}
              onMouseLeave={(e) => {
                if (!isListening) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping || isListening}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: inputText.trim() && !isTyping && !isListening
                ? 'linear-gradient(135deg, #10b981, #14b8a6)' 
                : '#e5e7eb',
              color: inputText.trim() && !isTyping && !isListening ? 'white' : '#9ca3af',
              cursor: inputText.trim() && !isTyping && !isListening ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: inputText.trim() && !isTyping && !isListening 
                ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                : 'none'
            }}
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* Quick action suggestions */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {['Book appointment', 'Set medicine reminder', 'Check symptoms', 'Emergency help'].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputText(suggestion)}
              style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}