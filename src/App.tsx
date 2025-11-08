// Health Sathi - Backend-Integrated Version
// This version connects to the Node.js backend API

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, FileText, Pill, User, Heart, Sparkles, Shield, Activity } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { EnhancedHealthChatbot } from './components/EnhancedHealthChatbot';
import { api } from './services/api';

function App() {
  // Simple state - which page are we on?
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Backend data storage
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Load data from backend on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test backend connection first
      console.log('🔌 Testing backend connection...');
      const connectionTest = await api.testConnection();
      console.log('📡 Connection test result:', connectionTest);
      
      setBackendConnected(connectionTest.connected);
      
      if (!connectionTest.connected) {
        throw new Error('Backend server is not available. Please ensure the server is running on port 5000.');
      }

      console.log('✅ Backend connected, loading data...');

      // Load all data in parallel
      const [appointmentsRes, medicinesRes, documentsRes, patientRes] = await Promise.allSettled([
        api.getAppointments(),
        api.getMedicines(),
        api.getDocuments(),
        api.getPatient()
      ]);

      // Handle appointments
      if (appointmentsRes.status === 'fulfilled') {
        setAppointments(appointmentsRes.value.data || []);
        console.log('📅 Loaded appointments:', appointmentsRes.value.data?.length || 0);
      } else {
        console.warn('Failed to load appointments:', appointmentsRes.reason);
        setAppointments([]);
      }

      // Handle medicines
      if (medicinesRes.status === 'fulfilled') {
        setMedicines(medicinesRes.value.data || []);
        console.log('💊 Loaded medicines:', medicinesRes.value.data?.length || 0);
      } else {
        console.warn('Failed to load medicines:', medicinesRes.reason);
        setMedicines([]);
      }

      // Handle documents
      if (documentsRes.status === 'fulfilled') {
        setDocuments(documentsRes.value.data || []);
        console.log('📄 Loaded documents:', documentsRes.value.data?.length || 0);
      } else {
        console.warn('Failed to load documents:', documentsRes.reason);
        setDocuments([]);
      }

      // Handle patient
      if (patientRes.status === 'fulfilled') {
        setPatient(patientRes.value.data);
        console.log('👤 Loaded patient:', patientRes.value.data?.name || 'Unknown');
      } else {
        console.warn('Failed to load patient:', patientRes.reason);
        // Set default patient if none exists
        setPatient({
          name: 'Health Sathi User',
          age: 0,
          bloodType: '',
          phone: '',
          emergency: ''
        });
      }

      console.log('✅ All data loaded successfully from backend');
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setError(error.message);
      setBackendConnected(false);
      
      // Use fallback data if backend is not available
      setAppointments([]);
      setMedicines([]);
      setDocuments([]);
      setPatient({
        name: 'Health Sathi User',
        age: 0,
        bloodType: '',
        phone: '',
        emergency: ''
      });
      
      console.log('🔄 Using offline mode with empty data');
    } finally {
      setLoading(false);
    }
  };

  // Simple CSS styles object
  const styles = {
    // Overall page styling
    page: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    },
    
    // Header styling
    header: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    
    headerTitle: {
      fontSize: '32px',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    
    headerSubtitle: {
      fontSize: '16px',
      margin: '10px 0 0 0',
      opacity: '0.9'
    },
    
    // Navigation styling
    nav: {
      backgroundColor: 'white',
      padding: '15px',
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    
    navButton: {
      padding: '12px 24px',
      border: '2px solid #10b981',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#10b981',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    },
    
    activeNavButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    
    // Content area styling
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: 'white',
      marginTop: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    
    // Card styling
    card: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      marginBottom: '15px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    
    cardHeader: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '10px'
    },
    
    cardContent: {
      color: '#6b7280',
      lineHeight: '1.6'
    },
    
    // Button styling
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '5px'
    },
    
    addButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    
    // Grid layout
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    
    // Status badges
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    
    urgentBadge: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    
    normalBadge: {
      backgroundColor: '#dcfce7',
      color: '#16a34a'
    }
  };

  // Backend-integrated functions for adding data
  const addAppointment = async () => {
    const doctor = prompt('Doctor name:');
    const date = prompt('Date (YYYY-MM-DD):');
    const time = prompt('Time (HH:MM):');
    const specialty = prompt('Specialty:');
    const location = prompt('Location:');
    
    if (doctor && date && time) {
      try {
        setLoading(true);
        const response = await api.createAppointment({
          doctor: doctor,
          specialty: specialty || 'General Practice',
          date: date,
          time: time,
          location: location || 'Clinic',
          status: 'scheduled'
        });
        
        if (response.success) {
          setAppointments(prev => [...prev, response.data]);
          alert('✅ Appointment scheduled successfully!');
        }
      } catch (error) {
        console.error('Failed to add appointment:', error);
        alert('❌ Failed to schedule appointment: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const addMedicine = async () => {
    const name = prompt('Medicine name:');
    const dosage = prompt('Dosage:');
    const frequency = prompt('Frequency (e.g., Daily, Twice daily):');
    const time = prompt('Time to take (HH:MM):');
    
    if (name && dosage && frequency) {
      try {
        setLoading(true);
        const times = time ? [time] : [];
        
        const response = await api.createMedicine({
          name: name,
          dosage: dosage,
          frequency: frequency,
          times: times,
          active: true,
          reminderEnabled: true
        });
        
        if (response.success) {
          setMedicines(prev => [...prev, response.data]);
          alert('✅ Medicine added successfully!');
        }
      } catch (error) {
        console.error('Failed to add medicine:', error);
        alert('❌ Failed to add medicine: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const addDocument = async () => {
    const name = prompt('Document name:');
    const type = prompt('Document type (e.g., Lab Report, Prescription):');
    const doctor = prompt('Doctor name:');
    const date = new Date().toISOString().split('T')[0];
    
    if (name && type) {
      try {
        setLoading(true);
        const response = await api.createDocument({
          name: name,
          type: type,
          date: date,
          doctor: doctor || 'Unknown',
          category: 'General'
        });
        
        if (response.success) {
          setDocuments(prev => [...prev, response.data]);
          alert('✅ Document added successfully!');
        }
      } catch (error) {
        console.error('Failed to add document:', error);
        alert('❌ Failed to add document: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Simple page navigation
  function showPage(page) {
    setCurrentPage(page);
  }

  // Show loading screen while connecting to backend
  if (loading && appointments.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #f0f9ff 50%, #ecfeff 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 20px',
            border: '4px solid #10b981',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ color: '#10b981', marginBottom: '10px' }}>
            {backendConnected ? 'Loading Health Data...' : 'Connecting to Backend...'}
          </h2>
          <p style={{ color: '#6b7280' }}>
            {backendConnected 
              ? 'Please wait while we load your health information'
              : 'Establishing connection with Health Sathi server'
            }
          </p>
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              ⚠️ {error}
            </div>
          )}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background with multiple gradient layers */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #f0fdfa 0%, #f0f9ff 50%, #ecfeff 100%)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(16,185,129,0.1) 0%, transparent 50%, rgba(20,184,166,0.1) 100%)'
      }}></div>
      
      {/* Floating decorative elements */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(20,184,166,0.2))',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulse 2s infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '160px',
        right: '80px',
        width: '128px',
        height: '128px',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.15))',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'pulse 2s infinite 1s'
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Enhanced Header */}
        <div style={{ marginBottom: '32px', position: 'relative' }}>
          {/* Floating health icons around header */}
          <div style={{
            position: 'absolute',
            top: '-16px',
            left: '-16px',
            color: 'rgba(16,185,129,0.4)',
            animation: 'bounce 2s infinite 0.5s'
          }}>
            <Sparkles size={24} />
          </div>
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-32px',
            color: 'rgba(20,184,166,0.4)',
            animation: 'bounce 2s infinite 1.5s'
          }}>
            <Shield size={20} />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            right: '16px',
            color: 'rgba(6,182,212,0.4)',
            animation: 'bounce 2s infinite 2.5s'
          }}>
            <Activity size={24} />
          </div>

          {/* Main header with enhanced styling */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <h1 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
              margin: 0
            }}>
              <div style={{ position: 'relative' }}>
                {/* Multiple pulse rings with different delays */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                  opacity: 0.75,
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                  opacity: 0.5,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  background: 'linear-gradient(45deg, #14b8a6, #06b6d4)',
                  opacity: 0.3,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s'
                }}></div>
                
                {/* Main icon container with enhanced styling */}
                <div style={{
                  position: 'relative',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  transition: 'all 0.5s ease',
                  cursor: 'pointer'
                }}>
                  {/* Inner glow effects */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.3)',
                    filter: 'blur(12px)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(20,184,166,0.3))'
                  }}></div>
                  
                  {/* Enhanced heart icon */}
                  <Heart 
                    size={32} 
                    fill="currentColor"
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  
                  {/* Floating plus symbols */}
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    zIndex: 20
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '2px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '1px'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        width: '2px',
                        height: '12px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '1px'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Sparkle effects */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    color: '#fde047',
                    animation: 'pulse 2s infinite',
                    opacity: 0
                  }}>
                    <Sparkles size={12} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    color: '#60a5fa',
                    animation: 'pulse 2s infinite 0.3s',
                    opacity: 0
                  }}>
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #059669, #0891b2, #0369a1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Health Sathi
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#14b8a6',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite 0.2s'
                    }}></div>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#06b6d4',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite 0.4s'
                    }}></div>
                  </div>
                  <span style={{
                    fontSize: '18px',
                    color: '#059669',
                    fontWeight: '600',
                    background: 'linear-gradient(45deg, #dcfce7, #f0fdfa)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid #bbf7d0'
                  }}>
                    Your Health Companion
                  </span>
                  <div style={{
                    padding: '2px 8px',
                    background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    animation: 'pulse 2s infinite'
                  }}>
                    24/7 Care
                  </div>
                </div>
              </div>
            </h1>
            
            <p style={{
              color: '#374151',
              marginLeft: '80px',
              fontSize: '18px',
              lineHeight: '1.6',
              margin: '16px 0 0 80px'
            }}>
              Comprehensive health management and wellness tracking at your fingertips
              <span style={{
                display: 'block',
                fontSize: '14px',
                color: '#059669',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                Designed with care for all ages • Trusted by thousands • Your privacy matters
              </span>
            </p>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '8px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            padding: '8px'
          }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                ...(currentPage === 'dashboard' 
                  ? {
                      background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      transform: 'scale(1.05)'
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#10b981'
                    }
                )
              }}
              onClick={() => showPage('dashboard')}
            >
              <Bell size={20} />
              <span>Dashboard</span>
              {currentPage === 'dashboard' && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '50%',
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}></div>
              )}
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                ...(currentPage === 'appointments' 
                  ? {
                      background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      transform: 'scale(1.05)'
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#10b981'
                    }
                )
              }}
              onClick={() => showPage('appointments')}
            >
              <Calendar size={20} />
              <span>Appointments</span>
              {appointments.length > 0 && (
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }}>
                  {appointments.length}
                </div>
              )}
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(currentPage === 'medicines' 
                  ? {
                      background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      transform: 'scale(1.05)'
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#10b981'
                    }
                )
              }}
              onClick={() => showPage('medicines')}
            >
              <Pill size={20} />
              <span>Medicines</span>
              {medicines.length > 0 && (
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }}>
                  {medicines.length}
                </div>
              )}
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(currentPage === 'documents' 
                  ? {
                      background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      transform: 'scale(1.05)'
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#10b981'
                    }
                )
              }}
              onClick={() => showPage('documents')}
            >
              <FileText size={20} />
              <span>Documents</span>
              {documents.length > 0 && (
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }}>
                  {documents.length}
                </div>
              )}
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(currentPage === 'profile' 
                  ? {
                      background: 'linear-gradient(45deg, #10b981, #14b8a6)',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      transform: 'scale(1.05)'
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#10b981'
                    }
                )
              }}
              onClick={() => showPage('profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Backend Connection Status */}
        {!backendConnected && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ color: '#92400e', fontWeight: 'bold' }}>⚠️ Backend Server Not Connected</span>
              <button 
                onClick={loadAllData}
                style={{
                  marginLeft: 'auto',
                  padding: '6px 12px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔄 Retry Connection
              </button>
            </div>
            <div style={{ color: '#92400e', fontSize: '14px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                The Health Sathi backend server is not running. To fix this:
              </p>
              <ol style={{ margin: '0', paddingLeft: '20px' }}>
                <li>Open a terminal/command prompt</li>
                <li>Navigate to your Health Sathi folder</li>
                <li>Run: <code style={{ backgroundColor: '#fbbf24', padding: '2px 4px', borderRadius: '2px', color: 'white' }}>npm run dev</code></li>
                <li>Wait for both servers to start</li>
                <li>Click "Retry Connection" above</li>
              </ol>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontStyle: 'italic' }}>
                💡 The app will work in offline mode until the backend is connected.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Section */}
        <div style={{ position: 'relative', marginTop: '32px' }}>
          
          {/* Dashboard Page */}
          {currentPage === 'dashboard' && (
            <Dashboard
              appointments={appointments}
              medicines={medicines}
              documents={documents}
              patientInfo={patient}
              onNavigateToAppointments={() => showPage('appointments')}
              backendConnected={backendConnected}
              onRefreshData={loadAllData}
            />
          )}

          {/* Appointments Page */}
          {currentPage === 'appointments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={32} style={{ color: '#10b981' }} />
                  Your Appointments
                  {backendConnected && (
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '12px'
                    }}>
                      🟢 Live Data
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={loadAllData}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Refresh
                  </button>
                  <button style={styles.addButton} onClick={addAppointment} disabled={loading}>
                    ➕ Add New Appointment
                  </button>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Loading appointments...
                </div>
              )}

              {appointments.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db'
                }}>
                  <Calendar size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                  <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>No Appointments Yet</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                    Schedule your first appointment to get started with Health Sathi
                  </p>
                  <button style={styles.addButton} onClick={addAppointment}>
                    ➕ Schedule First Appointment
                  </button>
                </div>
              ) : (
                appointments.map(appointment => (
                  <div key={appointment.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      {appointment.doctor}
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 'normal',
                        marginLeft: '8px'
                      }}>
                        ID: {appointment.id}
                      </span>
                    </div>
                    <div style={styles.cardContent}>
                      <p><strong>Specialty:</strong> {appointment.specialty}</p>
                      <p><strong>Date:</strong> {appointment.date} at {appointment.time}</p>
                      <p><strong>Location:</strong> {appointment.location}</p>
                      <p><strong>Status:</strong> {appointment.status || 'scheduled'}</p>
                      {appointment.notes && (
                        <p><strong>Notes:</strong> {appointment.notes}</p>
                      )}
                      <span style={{...styles.badge, ...styles.normalBadge}}>
                        {appointment.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Medicines Page */}
          {currentPage === 'medicines' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Pill size={32} style={{ color: '#3b82f6' }} />
                  Your Medicines
                  {backendConnected && (
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '12px'
                    }}>
                      🟢 Live Data
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={loadAllData}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Refresh
                  </button>
                  <button style={styles.addButton} onClick={addMedicine} disabled={loading}>
                    ➕ Add New Medicine
                  </button>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Loading medicines...
                </div>
              )}

              {medicines.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db'
                }}>
                  <Pill size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                  <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>No Medicines Added</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                    Add your medications to set up reminders and track your doses
                  </p>
                  <button style={styles.addButton} onClick={addMedicine}>
                    ➕ Add First Medicine
                  </button>
                </div>
              ) : (
                medicines.map(medicine => (
                  <div key={medicine.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      {medicine.name}
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 'normal',
                        marginLeft: '8px'
                      }}>
                        ID: {medicine.id}
                      </span>
                    </div>
                    <div style={styles.cardContent}>
                      <p><strong>Dosage:</strong> {medicine.dosage}</p>
                      {medicine.times && medicine.times.length > 0 ? (
                        <p><strong>Times:</strong> {medicine.times.join(', ')}</p>
                      ) : medicine.time ? (
                        <p><strong>Time:</strong> {medicine.time}</p>
                      ) : null}
                      <p><strong>Frequency:</strong> {medicine.frequency}</p>
                      {medicine.prescribedBy && (
                        <p><strong>Prescribed by:</strong> {medicine.prescribedBy}</p>
                      )}
                      {medicine.instructions && (
                        <p><strong>Instructions:</strong> {medicine.instructions}</p>
                      )}
                      <span style={{
                        ...styles.badge, 
                        ...(medicine.active !== false ? styles.normalBadge : styles.urgentBadge)
                      }}>
                        {medicine.active !== false ? 'Active' : 'Inactive'}
                      </span>
                      {medicine.reminderEnabled && (
                        <span style={{
                          ...styles.badge,
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          marginLeft: '8px'
                        }}>
                          🔔 Reminders On
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Documents Page */}
          {currentPage === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={32} style={{ color: '#8b5cf6' }} />
                  Your Medical Documents
                  {backendConnected && (
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      borderRadius: '12px'
                    }}>
                      🟢 Live Data
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={loadAllData}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Refresh
                  </button>
                  <button style={styles.addButton} onClick={addDocument} disabled={loading}>
                    ➕ Add New Document
                  </button>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Loading documents...
                </div>
              )}

              {documents.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db'
                }}>
                  <FileText size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                  <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>No Documents Stored</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                    Upload and organize your medical documents, lab reports, and prescriptions
                  </p>
                  <button style={styles.addButton} onClick={addDocument}>
                    ➕ Add First Document
                  </button>
                </div>
              ) : (
                documents.map(document => (
                  <div key={document.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      {document.name}
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 'normal',
                        marginLeft: '8px'
                      }}>
                        ID: {document.id}
                      </span>
                    </div>
                    <div style={styles.cardContent}>
                      <p><strong>Type:</strong> {document.type}</p>
                      <p><strong>Date:</strong> {document.date}</p>
                      <p><strong>Doctor:</strong> {document.doctor}</p>
                      {document.category && (
                        <p><strong>Category:</strong> {document.category}</p>
                      )}
                      {document.description && (
                        <p><strong>Description:</strong> {document.description}</p>
                      )}
                      {document.fileName && (
                        <p><strong>File:</strong> {document.originalName || document.fileName}</p>
                      )}
                      <span style={{...styles.badge, ...styles.normalBadge}}>Stored</span>
                      {document.fileName && (
                        <button
                          onClick={() => api.downloadDocument(document.id)}
                          style={{
                            marginLeft: '8px',
                            padding: '4px 8px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          📥 Download
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Page */}
          {currentPage === 'profile' && (
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <User size={32} style={{ color: '#059669' }} />
                Patient Profile
              </h2>
              
              <div style={styles.card}>
                <div style={styles.cardHeader}>Personal Information</div>
                <div style={styles.cardContent}>
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>Age:</strong> {patient.age} years old</p>
                  <p><strong>Blood Type:</strong> {patient.bloodType}</p>
                  <p><strong>Phone:</strong> {patient.phone}</p>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>Emergency Contact</div>
                <div style={styles.cardContent}>
                  <p><strong>Contact:</strong> {patient.emergency}</p>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>Medical Summary</div>
                <div style={styles.cardContent}>
                  <p><strong>Active Appointments:</strong> {appointments.length}</p>
                  <p><strong>Current Medicines:</strong> {medicines.length}</p>
                  <p><strong>Documents on File:</strong> {documents.length}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom decorative wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '128px',
        background: 'linear-gradient(to top, rgba(16,185,129,0.2), transparent)',
        pointerEvents: 'none'
      }}></div>
      
      {/* Footer */}
      <footer style={{ 
        position: 'relative',
        zIndex: 10,
        textAlign: 'center', 
        padding: '20px', 
        color: '#6b7280',
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
        marginTop: '20px'
      }}>
        <p>Health Sathi - Your trusted health companion since 2025</p>
        <p style={{ fontSize: '12px' }}>Always consult with healthcare professionals for medical advice</p>
      </footer>
      
      {/* Enhanced Health Chatbot */}
      <EnhancedHealthChatbot
        onScheduleAppointment={() => showPage('appointments')}
        onAddMedicine={() => showPage('medicines')}
        onViewDocuments={() => showPage('documents')}
      />

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8,0,1,1);
          }
          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0,0,0.2,1);
          }
        }
      `}</style>
    </div>
  );
}

export default App;