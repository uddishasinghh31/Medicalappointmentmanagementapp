// Health Data & Analytics API Routes
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database paths for different health data
const appointmentsPath = path.join(__dirname, '..', 'database', 'appointments.json');
const medicinesPath = path.join(__dirname, '..', 'database', 'medicines.json');
const documentsPath = path.join(__dirname, '..', 'database', 'documents.json');
const patientsPath = path.join(__dirname, '..', 'database', 'patients.json');
const vitalsPath = path.join(__dirname, '..', 'database', 'vitals.json');

// Ensure vitals database exists
const ensureVitalsDB = () => {
  if (!fs.existsSync(vitalsPath)) {
    fs.writeJsonSync(vitalsPath, [], { spaces: 2 });
  }
};

// Helper functions to read data
const readAppointments = () => {
  try {
    return fs.readJsonSync(appointmentsPath);
  } catch { return []; }
};

const readMedicines = () => {
  try {
    return fs.readJsonSync(medicinesPath);
  } catch { return []; }
};

const readDocuments = () => {
  try {
    return fs.readJsonSync(documentsPath);
  } catch { return []; }
};

const readPatients = () => {
  try {
    return fs.readJsonSync(patientsPath);
  } catch { return []; }
};

const readVitals = () => {
  try {
    ensureVitalsDB();
    return fs.readJsonSync(vitalsPath);
  } catch { return []; }
};

const writeVitals = (vitals) => {
  try {
    ensureVitalsDB();
    fs.writeJsonSync(vitalsPath, vitals, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error writing vitals:', error);
    return false;
  }
};

// GET /api/health-data/dashboard - Get dashboard summary
router.get('/dashboard', (req, res) => {
  try {
    const appointments = readAppointments();
    const medicines = readMedicines();
    const documents = readDocuments();
    const patients = readPatients();
    const vitals = readVitals();

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Upcoming appointments
    const upcomingAppointments = appointments
      .filter(apt => {
        const aptDate = new Date(`${apt.date} ${apt.time}`);
        return aptDate > now && apt.status !== 'cancelled';
      })
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
      .slice(0, 3);

    // Today's medicines
    const todaysMedicines = medicines
      .filter(med => med.active !== false && med.times && med.times.length > 0)
      .map(med => ({
        ...med,
        nextDose: getNextDoseTime(med.times)
      }))
      .sort((a, b) => a.nextDose - b.nextDose);

    // Recent vitals
    const recentVitals = vitals
      .filter(vital => new Date(vital.date) >= thisWeek)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Health statistics
    const stats = {
      totalAppointments: appointments.length,
      upcomingAppointments: upcomingAppointments.length,
      appointmentsThisMonth: appointments.filter(apt => 
        new Date(apt.date) >= thisMonth
      ).length,
      
      totalMedicines: medicines.filter(med => med.active !== false).length,
      medicinesDueToday: todaysMedicines.length,
      missedDoses: medicines.reduce((total, med) => total + (med.missedDoses || 0), 0),
      
      totalDocuments: documents.length,
      documentsThisMonth: documents.filter(doc => 
        new Date(doc.date) >= thisMonth
      ).length,
      
      vitalsRecorded: vitals.length,
      vitalsThisWeek: recentVitals.length
    };

    // Health alerts
    const alerts = [];
    
    // Check for overdue appointments
    const overdueAppointments = appointments.filter(apt => {
      const aptDate = new Date(`${apt.date} ${apt.time}`);
      return aptDate < now && apt.status === 'scheduled';
    });
    
    if (overdueAppointments.length > 0) {
      alerts.push({
        type: 'warning',
        message: `You have ${overdueAppointments.length} overdue appointment(s)`,
        action: 'View Appointments'
      });
    }

    // Check for medicine reminders
    const currentHour = now.getHours();
    const upcomingMedicines = todaysMedicines.filter(med => {
      return med.times.some(time => {
        const [hours] = time.split(':').map(Number);
        return hours >= currentHour && hours <= currentHour + 2;
      });
    });

    if (upcomingMedicines.length > 0) {
      alerts.push({
        type: 'info',
        message: `${upcomingMedicines.length} medicine(s) due in the next 2 hours`,
        action: 'View Medicines'
      });
    }

    // Check for missing vital signs
    const lastVitalDate = vitals.length > 0 ? new Date(vitals[0].date) : null;
    const daysSinceLastVital = lastVitalDate ? 
      Math.floor((now - lastVitalDate) / (1000 * 60 * 60 * 24)) : null;
    
    if (!lastVitalDate || daysSinceLastVital > 7) {
      alerts.push({
        type: 'reminder',
        message: 'Consider recording your vital signs',
        action: 'Record Vitals'
      });
    }

    const dashboardData = {
      summary: stats,
      upcomingAppointments,
      todaysMedicines: todaysMedicines.slice(0, 5),
      recentVitals,
      alerts,
      patient: patients[0] || null,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard data',
      message: error.message
    });
  }
});

// GET /api/health-data/vitals - Get all vital signs
router.get('/vitals', (req, res) => {
  try {
    const vitals = readVitals();
    
    // Sort by date (most recent first)
    const sortedVitals = vitals.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: sortedVitals,
      count: vitals.length,
      message: 'Vital signs retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve vital signs',
      message: error.message
    });
  }
});

// POST /api/health-data/vitals - Record new vital signs
router.post('/vitals', (req, res) => {
  try {
    const { 
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      weight,
      height,
      bloodSugar,
      oxygenSaturation,
      date,
      time,
      notes
    } = req.body;

    // Validation
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required',
        message: 'Please provide a date for the vital signs'
      });
    }

    // Validate date
    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date',
        message: 'Please provide a valid date'
      });
    }

    // Validate numerical values
    const numericValidations = [
      { field: 'bloodPressureSystolic', min: 60, max: 250 },
      { field: 'bloodPressureDiastolic', min: 30, max: 150 },
      { field: 'heartRate', min: 30, max: 220 },
      { field: 'temperature', min: 90, max: 110 },
      { field: 'weight', min: 20, max: 500 },
      { field: 'height', min: 50, max: 250 },
      { field: 'bloodSugar', min: 20, max: 600 },
      { field: 'oxygenSaturation', min: 70, max: 100 }
    ];

    for (const validation of numericValidations) {
      const value = req.body[validation.field];
      if (value !== undefined && value !== null && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < validation.min || numValue > validation.max) {
          return res.status(400).json({
            success: false,
            error: `Invalid ${validation.field}`,
            message: `${validation.field} must be between ${validation.min} and ${validation.max}`
          });
        }
      }
    }

    const vitals = readVitals();
    
    const newVital = {
      id: uuidv4(),
      date: date,
      time: time || new Date().toTimeString().slice(0, 5),
      bloodPressureSystolic: bloodPressureSystolic ? parseFloat(bloodPressureSystolic) : null,
      bloodPressureDiastolic: bloodPressureDiastolic ? parseFloat(bloodPressureDiastolic) : null,
      heartRate: heartRate ? parseFloat(heartRate) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      bloodSugar: bloodSugar ? parseFloat(bloodSugar) : null,
      oxygenSaturation: oxygenSaturation ? parseFloat(oxygenSaturation) : null,
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vitals.push(newVital);
    
    if (writeVitals(vitals)) {
      res.status(201).json({
        success: true,
        data: newVital,
        message: 'Vital signs recorded successfully'
      });
    } else {
      throw new Error('Failed to save vital signs');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record vital signs',
      message: error.message
    });
  }
});

// GET /api/health-data/analytics - Get health analytics
router.get('/analytics', (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const days = parseInt(period);
    
    const vitals = readVitals();
    const appointments = readAppointments();
    const medicines = readMedicines();
    
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    // Filter data by period
    const recentVitals = vitals.filter(vital => new Date(vital.date) >= startDate);
    const recentAppointments = appointments.filter(apt => new Date(apt.date) >= startDate);
    
    // Blood pressure trends
    const bpTrends = recentVitals
      .filter(v => v.bloodPressureSystolic && v.bloodPressureDiastolic)
      .map(v => ({
        date: v.date,
        systolic: v.bloodPressureSystolic,
        diastolic: v.bloodPressureDiastolic
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Weight trends
    const weightTrends = recentVitals
      .filter(v => v.weight)
      .map(v => ({
        date: v.date,
        weight: v.weight
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Heart rate trends
    const heartRateTrends = recentVitals
      .filter(v => v.heartRate)
      .map(v => ({
        date: v.date,
        heartRate: v.heartRate
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Medicine adherence
    const activeMedicines = medicines.filter(med => med.active !== false);
    const adherenceData = activeMedicines.map(med => {
      const totalDoses = med.doseTaken ? med.doseTaken.length : 0;
      const missedDoses = med.missedDoses || 0;
      const adherenceRate = totalDoses + missedDoses > 0 ? 
        (totalDoses / (totalDoses + missedDoses)) * 100 : 100;
      
      return {
        medicine: med.name,
        adherenceRate: Math.round(adherenceRate),
        totalDoses,
        missedDoses
      };
    });
    
    // Appointment frequency
    const appointmentFrequency = recentAppointments.reduce((acc, apt) => {
      const month = new Date(apt.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const analytics = {
      period: `${days} days`,
      trends: {
        bloodPressure: bpTrends,
        weight: weightTrends,
        heartRate: heartRateTrends
      },
      adherence: adherenceData,
      appointments: appointmentFrequency,
      summary: {
        vitalsRecorded: recentVitals.length,
        appointmentsAttended: recentAppointments.filter(apt => apt.status === 'completed').length,
        averageAdherence: adherenceData.length > 0 ? 
          Math.round(adherenceData.reduce((sum, med) => sum + med.adherenceRate, 0) / adherenceData.length) : 100
      }
    };

    res.json({
      success: true,
      data: analytics,
      message: 'Health analytics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve health analytics',
      message: error.message
    });
  }
});

// Helper function to get next dose time
function getNextDoseTime(times) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  for (const time of times) {
    const [hours, minutes] = time.split(':').map(Number);
    const doseTime = hours * 60 + minutes;
    
    if (doseTime > currentTime) {
      return doseTime;
    }
  }
  
  // If no dose time is left today, return the first dose time tomorrow
  const [hours, minutes] = times[0].split(':').map(Number);
  return (hours * 60 + minutes) + (24 * 60); // Add 24 hours
}

module.exports = router;