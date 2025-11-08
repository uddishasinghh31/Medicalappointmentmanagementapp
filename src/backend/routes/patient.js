// Patient Profile API Routes
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'database', 'patients.json');

// Helper function to read patients from database
const readPatients = () => {
  try {
    return fs.readJsonSync(dbPath);
  } catch (error) {
    console.error('Error reading patients:', error);
    return [];
  }
};

// Helper function to write patients to database
const writePatients = (patients) => {
  try {
    fs.writeJsonSync(dbPath, patients, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error writing patients:', error);
    return false;
  }
};

// GET /api/patient - Get patient profile (assuming single patient for now)
router.get('/', (req, res) => {
  try {
    const patients = readPatients();
    
    // For now, return the first patient (single user app)
    const patient = patients[0];
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient profile not found',
        message: 'No patient profile exists. Please create one.'
      });
    }

    res.json({
      success: true,
      data: patient,
      message: 'Patient profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patient profile',
      message: error.message
    });
  }
});

// GET /api/patient/:id - Get specific patient by ID
router.get('/:id', (req, res) => {
  try {
    const patients = readPatients();
    const patient = patients.find(p => p.id === req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        message: `No patient found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: patient,
      message: 'Patient retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patient',
      message: error.message
    });
  }
});

// POST /api/patient - Create new patient profile
router.post('/', (req, res) => {
  try {
    const { 
      name, 
      age, 
      bloodType, 
      phone, 
      email, 
      address, 
      emergency, 
      emergencyPhone,
      emergencyRelation,
      medicalHistory,
      allergies,
      currentConditions,
      insurance,
      primaryDoctor,
      dateOfBirth,
      gender,
      height,
      weight
    } = req.body;

    // Validation
    if (!name || !age) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name and age are required'
      });
    }

    // Validate age
    if (age < 0 || age > 150) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age',
        message: 'Age must be between 0 and 150'
      });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate date of birth if provided
    if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date of birth',
        message: 'Please provide a valid date of birth'
      });
    }

    const patients = readPatients();
    
    // Check if patient with same name already exists (for single user app, might want to prevent duplicates)
    const existingPatient = patients.find(p => 
      p.name.toLowerCase() === name.toLowerCase().trim()
    );

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: 'Patient already exists',
        message: `A patient named "${name}" already exists`
      });
    }

    const newPatient = {
      id: uuidv4(),
      name: name.trim(),
      age: parseInt(age),
      bloodType: bloodType?.trim() || '',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      address: address?.trim() || '',
      emergency: emergency?.trim() || '',
      emergencyPhone: emergencyPhone?.trim() || '',
      emergencyRelation: emergencyRelation?.trim() || '',
      medicalHistory: medicalHistory?.trim() || '',
      allergies: allergies?.trim() || '',
      currentConditions: currentConditions?.trim() || '',
      insurance: insurance?.trim() || '',
      primaryDoctor: primaryDoctor?.trim() || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender?.trim() || '',
      height: height?.trim() || '',
      weight: weight?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastVisit: null,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    patients.push(newPatient);
    
    if (writePatients(patients)) {
      res.status(201).json({
        success: true,
        data: newPatient,
        message: 'Patient profile created successfully'
      });
    } else {
      throw new Error('Failed to save patient profile');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create patient profile',
      message: error.message
    });
  }
});

// PUT /api/patient - Update patient profile (primary patient)
router.put('/', (req, res) => {
  try {
    const patients = readPatients();
    
    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No patient profile found',
        message: 'Create a patient profile first'
      });
    }

    const patientIndex = 0; // Update first patient (single user app)
    
    const { 
      name, 
      age, 
      bloodType, 
      phone, 
      email, 
      address, 
      emergency, 
      emergencyPhone,
      emergencyRelation,
      medicalHistory,
      allergies,
      currentConditions,
      insurance,
      primaryDoctor,
      dateOfBirth,
      gender,
      height,
      weight
    } = req.body;

    // Validate age if provided
    if (age && (age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age',
        message: 'Age must be between 0 and 150'
      });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate date of birth if provided
    if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date of birth',
        message: 'Please provide a valid date of birth'
      });
    }

    // Update patient
    const updatedPatient = {
      ...patients[patientIndex],
      ...(name && { name: name.trim() }),
      ...(age && { age: parseInt(age) }),
      ...(bloodType !== undefined && { bloodType: bloodType.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(address !== undefined && { address: address.trim() }),
      ...(emergency !== undefined && { emergency: emergency.trim() }),
      ...(emergencyPhone !== undefined && { emergencyPhone: emergencyPhone.trim() }),
      ...(emergencyRelation !== undefined && { emergencyRelation: emergencyRelation.trim() }),
      ...(medicalHistory !== undefined && { medicalHistory: medicalHistory.trim() }),
      ...(allergies !== undefined && { allergies: allergies.trim() }),
      ...(currentConditions !== undefined && { currentConditions: currentConditions.trim() }),
      ...(insurance !== undefined && { insurance: insurance.trim() }),
      ...(primaryDoctor !== undefined && { primaryDoctor: primaryDoctor.trim() }),
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(gender !== undefined && { gender: gender.trim() }),
      ...(height !== undefined && { height: height.trim() }),
      ...(weight !== undefined && { weight: weight.trim() }),
      updatedAt: new Date().toISOString()
    };

    patients[patientIndex] = updatedPatient;
    
    if (writePatients(patients)) {
      res.json({
        success: true,
        data: updatedPatient,
        message: 'Patient profile updated successfully'
      });
    } else {
      throw new Error('Failed to save updated patient profile');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update patient profile',
      message: error.message
    });
  }
});

// PUT /api/patient/:id - Update specific patient by ID
router.put('/:id', (req, res) => {
  try {
    const patients = readPatients();
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    
    if (patientIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        message: `No patient found with ID: ${req.params.id}`
      });
    }

    const { 
      name, 
      age, 
      bloodType, 
      phone, 
      email, 
      address, 
      emergency, 
      emergencyPhone,
      emergencyRelation,
      medicalHistory,
      allergies,
      currentConditions,
      insurance,
      primaryDoctor,
      dateOfBirth,
      gender,
      height,
      weight
    } = req.body;

    // Similar validation as above...
    if (age && (age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age',
        message: 'Age must be between 0 and 150'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date of birth',
        message: 'Please provide a valid date of birth'
      });
    }

    // Update patient
    const updatedPatient = {
      ...patients[patientIndex],
      ...(name && { name: name.trim() }),
      ...(age && { age: parseInt(age) }),
      ...(bloodType !== undefined && { bloodType: bloodType.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(address !== undefined && { address: address.trim() }),
      ...(emergency !== undefined && { emergency: emergency.trim() }),
      ...(emergencyPhone !== undefined && { emergencyPhone: emergencyPhone.trim() }),
      ...(emergencyRelation !== undefined && { emergencyRelation: emergencyRelation.trim() }),
      ...(medicalHistory !== undefined && { medicalHistory: medicalHistory.trim() }),
      ...(allergies !== undefined && { allergies: allergies.trim() }),
      ...(currentConditions !== undefined && { currentConditions: currentConditions.trim() }),
      ...(insurance !== undefined && { insurance: insurance.trim() }),
      ...(primaryDoctor !== undefined && { primaryDoctor: primaryDoctor.trim() }),
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(gender !== undefined && { gender: gender.trim() }),
      ...(height !== undefined && { height: height.trim() }),
      ...(weight !== undefined && { weight: weight.trim() }),
      updatedAt: new Date().toISOString()
    };

    patients[patientIndex] = updatedPatient;
    
    if (writePatients(patients)) {
      res.json({
        success: true,
        data: updatedPatient,
        message: 'Patient updated successfully'
      });
    } else {
      throw new Error('Failed to save updated patient');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update patient',
      message: error.message
    });
  }
});

// DELETE /api/patient/:id - Delete patient
router.delete('/:id', (req, res) => {
  try {
    const patients = readPatients();
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    
    if (patientIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        message: `No patient found with ID: ${req.params.id}`
      });
    }

    const deletedPatient = patients.splice(patientIndex, 1)[0];
    
    if (writePatients(patients)) {
      res.json({
        success: true,
        data: deletedPatient,
        message: 'Patient deleted successfully'
      });
    } else {
      throw new Error('Failed to save after deletion');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete patient',
      message: error.message
    });
  }
});

// GET /api/patient/summary - Get patient summary with stats
router.get('/summary', (req, res) => {
  try {
    const patients = readPatients();
    
    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No patient profile found',
        message: 'Create a patient profile first'
      });
    }

    const patient = patients[0]; // Primary patient
    
    // You could add more stats here by reading from other database files
    const summary = {
      ...patient,
      stats: {
        profileCompleteness: calculateProfileCompleteness(patient),
        lastUpdated: patient.updatedAt,
        registrationDate: patient.registrationDate
      }
    };

    res.json({
      success: true,
      data: summary,
      message: 'Patient summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patient summary',
      message: error.message
    });
  }
});

// Helper function to calculate profile completeness
function calculateProfileCompleteness(patient) {
  const requiredFields = [
    'name', 'age', 'bloodType', 'phone', 'email', 'address', 
    'emergency', 'emergencyPhone', 'emergencyRelation'
  ];
  
  const completedFields = requiredFields.filter(field => 
    patient[field] && patient[field].toString().trim() !== ''
  );
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
}

module.exports = router;