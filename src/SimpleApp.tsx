// Ultra-Simple Version of Health Sathi
// This is as simple as it gets while still being functional!

import React, { useState } from 'react';
import { Heart, Calendar, Pill, Plus } from 'lucide-react';

function SimpleApp() {
  // Simple state variables
  const [currentPage, setCurrentPage] = useState('home');
  const [appointments, setAppointments] = useState([
    'Dr. Smith - Sep 10, 10:00 AM',
    'Dr. Johnson - Sep 15, 2:00 PM'
  ]);
  const [medicines, setMedicines] = useState([
    'Aspirin - 8:00 AM daily',
    'Vitamin D - 6:00 PM daily'
  ]);

  // Simple functions
  function goToPage(page) {
    setCurrentPage(page);
  }

  function addAppointment() {
    const newAppointment = prompt('Enter appointment details:');
    if (newAppointment) {
      setAppointments([...appointments, newAppointment]);
    }
  }

  function addMedicine() {
    const newMedicine = prompt('Enter medicine details:');
    if (newMedicine) {
      setMedicines([...medicines, newMedicine]);
    }
  }

  // Simple styles
  const styles = {
    app: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8fafc'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      color: '#16a34a',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#64748b',
      margin: '10px 0 0 0'
    },
    nav: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      justifyContent: 'center'
    },
    navButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#e2e8f0',
      color: '#475569',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    activeNavButton: {
      backgroundColor: '#16a34a',
      color: 'white'
    },
    content: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    addButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    listItem: {
      padding: '15px',
      backgroundColor: '#f1f5f9',
      marginBottom: '10px',
      borderRadius: '8px',
      borderLeft: '4px solid #16a34a'
    },
    welcomeCard: {
      padding: '20px',
      backgroundColor: '#f0f9ff',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.app}>
      {/* Simple Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Heart color="#ef4444" size={36} />
          Health Sathi
        </h1>
        <p style={styles.subtitle}>Your Simple Health Companion</p>
      </div>

      {/* Simple Navigation */}
      <div style={styles.nav}>
        <button 
          style={{
            ...styles.navButton,
            ...(currentPage === 'home' ? styles.activeNavButton : {})
          }}
          onClick={() => goToPage('home')}
        >
          🏠 Home
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(currentPage === 'appointments' ? styles.activeNavButton : {})
          }}
          onClick={() => goToPage('appointments')}
        >
          <Calendar size={20} />
          Appointments
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(currentPage === 'medicines' ? styles.activeNavButton : {})
          }}
          onClick={() => goToPage('medicines')}
        >
          <Pill size={20} />
          Medicines
        </button>
      </div>

      {/* Simple Content */}
      <div style={styles.content}>
        
        {/* Home Page */}
        {currentPage === 'home' && (
          <div>
            <div style={styles.welcomeCard}>
              <h2>Welcome to Health Sathi! 👋</h2>
              <p>Manage your health appointments and medicines easily</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <h3>📅 Appointments</h3>
                <p>You have {appointments.length} upcoming appointments</p>
                <button onClick={() => goToPage('appointments')} style={styles.addButton}>
                  View All
                </button>
              </div>
              
              <div style={{ padding: '20px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <h3>💊 Medicines</h3>
                <p>You are tracking {medicines.length} medicines</p>
                <button onClick={() => goToPage('medicines')} style={styles.addButton}>
                  View All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Page */}
        {currentPage === 'appointments' && (
          <div>
            <h2>📅 Your Appointments</h2>
            
            <button style={styles.addButton} onClick={addAppointment}>
              <Plus size={20} />
              Add New Appointment
            </button>

            <div>
              {appointments.map((appointment, index) => (
                <div key={index} style={styles.listItem}>
                  {appointment}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medicines Page */}
        {currentPage === 'medicines' && (
          <div>
            <h2>💊 Your Medicines</h2>
            
            <button style={styles.addButton} onClick={addMedicine}>
              <Plus size={20} />
              Add New Medicine
            </button>

            <div>
              {medicines.map((medicine, index) => (
                <div key={index} style={styles.listItem}>
                  {medicine}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SimpleApp;