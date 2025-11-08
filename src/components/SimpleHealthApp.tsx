// Alternative Simple Version of Health Sathi
// This version uses basic HTML-like structure with minimal React

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Heart, Calendar, Pill, FileText, User } from 'lucide-react';

export function SimpleHealthApp() {
  // Simple state - no complex TypeScript
  const [activeSection, setActiveSection] = useState('dashboard');
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Smith', date: '2025-09-10', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Johnson', date: '2025-09-15', time: '2:00 PM' }
  ]);
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Aspirin', time: '8:00 AM', dosage: '100mg' },
    { id: 2, name: 'Vitamin D', time: '6:00 PM', dosage: '1000 IU' }
  ]);

  // Simple functions
  function showSection(section) {
    setActiveSection(section);
  }

  function addAppointment() {
    const doctor = prompt('Doctor name:');
    const date = prompt('Date (YYYY-MM-DD):');
    const time = prompt('Time:');
    
    if (doctor && date && time) {
      const newAppointment = {
        id: Date.now(),
        doctor: doctor,
        date: date,
        time: time
      };
      setAppointments([...appointments, newAppointment]);
    }
  }

  function addMedicine() {
    const name = prompt('Medicine name:');
    const time = prompt('Time to take:');
    const dosage = prompt('Dosage:');
    
    if (name && time && dosage) {
      const newMedicine = {
        id: Date.now(),
        name: name,
        time: time,
        dosage: dosage
      };
      setMedicines([...medicines, newMedicine]);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Simple Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <Heart style={{ color: '#dc2626' }} size={40} />
          Health Sathi
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>Your Simple Health Companion</p>
      </div>

      {/* Simple Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <Button 
          onClick={() => showSection('dashboard')}
          style={{ backgroundColor: activeSection === 'dashboard' ? '#16a34a' : '#e5e7eb' }}
        >
          <Calendar size={20} style={{ marginRight: '8px' }} />
          Dashboard
        </Button>
        <Button 
          onClick={() => showSection('appointments')}
          style={{ backgroundColor: activeSection === 'appointments' ? '#16a34a' : '#e5e7eb' }}
        >
          <Calendar size={20} style={{ marginRight: '8px' }} />
          Appointments
        </Button>
        <Button 
          onClick={() => showSection('medicines')}
          style={{ backgroundColor: activeSection === 'medicines' ? '#16a34a' : '#e5e7eb' }}
        >
          <Pill size={20} style={{ marginRight: '8px' }} />
          Medicines
        </Button>
      </div>

      {/* Simple Content Sections */}
      
      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Welcome to Your Health Dashboard</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Card>
              <CardContent style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#16a34a' }}>Upcoming Appointments</h3>
                <p style={{ color: '#6b7280' }}>You have {appointments.length} upcoming appointments</p>
                <Button onClick={() => showSection('appointments')} style={{ marginTop: '10px' }}>
                  View All
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#2563eb' }}>Medicine Schedule</h3>
                <p style={{ color: '#6b7280' }}>You have {medicines.length} medicines to track</p>
                <Button onClick={() => showSection('medicines')} style={{ marginTop: '10px' }}>
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Appointments Section */}
      {activeSection === 'appointments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#374151' }}>Your Appointments</h2>
            <Button onClick={addAppointment} style={{ backgroundColor: '#16a34a' }}>
              Add Appointment
            </Button>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {appointments.map(appointment => (
              <Card key={appointment.id}>
                <CardContent style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#374151' }}>{appointment.doctor}</h3>
                      <p style={{ color: '#6b7280' }}>{appointment.date} at {appointment.time}</p>
                    </div>
                    <Calendar size={24} style={{ color: '#16a34a' }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medicines Section */}
      {activeSection === 'medicines' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#374151' }}>Your Medicines</h2>
            <Button onClick={addMedicine} style={{ backgroundColor: '#2563eb' }}>
              Add Medicine
            </Button>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {medicines.map(medicine => (
              <Card key={medicine.id}>
                <CardContent style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#374151' }}>{medicine.name}</h3>
                      <p style={{ color: '#6b7280' }}>Take {medicine.dosage} at {medicine.time}</p>
                    </div>
                    <Pill size={24} style={{ color: '#2563eb' }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}