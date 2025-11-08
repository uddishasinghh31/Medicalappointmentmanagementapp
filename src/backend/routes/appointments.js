// Appointments API Routes
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'database', 'appointments.json');

// Helper function to read appointments from database
const readAppointments = () => {
  try {
    return fs.readJsonSync(dbPath);
  } catch (error) {
    console.error('Error reading appointments:', error);
    return [];
  }
};

// Helper function to write appointments to database
const writeAppointments = (appointments) => {
  try {
    fs.writeJsonSync(dbPath, appointments, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error writing appointments:', error);
    return false;
  }
};

// GET /api/appointments - Get all appointments
router.get('/', (req, res) => {
  try {
    const appointments = readAppointments();
    
    // Sort appointments by date and time
    const sortedAppointments = appointments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    res.json({
      success: true,
      data: sortedAppointments,
      count: appointments.length,
      message: 'Appointments retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve appointments',
      message: error.message
    });
  }
});

// GET /api/appointments/:id - Get single appointment
router.get('/:id', (req, res) => {
  try {
    const appointments = readAppointments();
    const appointment = appointments.find(apt => apt.id === req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve appointment',
      message: error.message
    });
  }
});

// POST /api/appointments - Create new appointment
router.post('/', (req, res) => {
  try {
    const { doctor, specialty, date, time, location, notes, type, status } = req.body;

    // Validation
    if (!doctor || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Doctor, date, and time are required'
      });
    }

    // Validate date format
    const appointmentDate = new Date(`${date} ${time}`);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date/time format',
        message: 'Please provide valid date and time'
      });
    }

    // Check if appointment is in the past
    if (appointmentDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid appointment time',
        message: 'Cannot schedule appointments in the past'
      });
    }

    const appointments = readAppointments();
    
    // Check for scheduling conflicts
    const conflictingAppointment = appointments.find(apt => 
      apt.date === date && 
      apt.time === time && 
      apt.doctor === doctor
    );

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        error: 'Scheduling conflict',
        message: 'An appointment already exists at this time with this doctor'
      });
    }

    const newAppointment = {
      id: uuidv4(),
      doctor: doctor.trim(),
      specialty: specialty?.trim() || 'General Practice',
      date: date,
      time: time,
      location: location?.trim() || 'Clinic',
      notes: notes?.trim() || '',
      type: type || 'consultation',
      status: status || 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: false
    };

    appointments.push(newAppointment);
    
    if (writeAppointments(appointments)) {
      res.status(201).json({
        success: true,
        data: newAppointment,
        message: 'Appointment created successfully'
      });
    } else {
      throw new Error('Failed to save appointment');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment',
      message: error.message
    });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', (req, res) => {
  try {
    const appointments = readAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === req.params.id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    const { doctor, specialty, date, time, location, notes, type, status } = req.body;

    // Validation for date/time if provided
    if ((date || time) && (!date || !time)) {
      return res.status(400).json({
        success: false,
        error: 'Incomplete date/time',
        message: 'Both date and time must be provided together'
      });
    }

    if (date && time) {
      const appointmentDate = new Date(`${date} ${time}`);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date/time format',
          message: 'Please provide valid date and time'
        });
      }
    }

    // Update appointment
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...(doctor && { doctor: doctor.trim() }),
      ...(specialty && { specialty: specialty.trim() }),
      ...(date && { date }),
      ...(time && { time }),
      ...(location && { location: location.trim() }),
      ...(notes !== undefined && { notes: notes.trim() }),
      ...(type && { type }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    appointments[appointmentIndex] = updatedAppointment;
    
    if (writeAppointments(appointments)) {
      res.json({
        success: true,
        data: updatedAppointment,
        message: 'Appointment updated successfully'
      });
    } else {
      throw new Error('Failed to save updated appointment');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
      message: error.message
    });
  }
});

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', (req, res) => {
  try {
    const appointments = readAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === req.params.id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];
    
    if (writeAppointments(appointments)) {
      res.json({
        success: true,
        data: deletedAppointment,
        message: 'Appointment deleted successfully'
      });
    } else {
      throw new Error('Failed to save after deletion');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment',
      message: error.message
    });
  }
});

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/filter/upcoming', (req, res) => {
  try {
    const appointments = readAppointments();
    const now = new Date();
    
    const upcomingAppointments = appointments
      .filter(apt => {
        const appointmentDate = new Date(`${apt.date} ${apt.time}`);
        return appointmentDate > now && apt.status !== 'cancelled';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      });

    res.json({
      success: true,
      data: upcomingAppointments,
      count: upcomingAppointments.length,
      message: 'Upcoming appointments retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve upcoming appointments',
      message: error.message
    });
  }
});

module.exports = router;