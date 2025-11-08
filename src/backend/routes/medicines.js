// Medicines API Routes
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'database', 'medicines.json');

// Helper function to read medicines from database
const readMedicines = () => {
  try {
    return fs.readJsonSync(dbPath);
  } catch (error) {
    console.error('Error reading medicines:', error);
    return [];
  }
};

// Helper function to write medicines to database
const writeMedicines = (medicines) => {
  try {
    fs.writeJsonSync(dbPath, medicines, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error writing medicines:', error);
    return false;
  }
};

// GET /api/medicines - Get all medicines
router.get('/', (req, res) => {
  try {
    const medicines = readMedicines();
    
    // Sort medicines by name
    const sortedMedicines = medicines.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: sortedMedicines,
      count: medicines.length,
      message: 'Medicines retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve medicines',
      message: error.message
    });
  }
});

// GET /api/medicines/:id - Get single medicine
router.get('/:id', (req, res) => {
  try {
    const medicines = readMedicines();
    const medicine = medicines.find(med => med.id === req.params.id);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found',
        message: `No medicine found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: medicine,
      message: 'Medicine retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve medicine',
      message: error.message
    });
  }
});

// POST /api/medicines - Create new medicine
router.post('/', (req, res) => {
  try {
    const { 
      name, 
      dosage, 
      frequency, 
      times, 
      duration, 
      prescribedBy, 
      startDate, 
      endDate,
      instructions,
      sideEffects,
      category,
      active
    } = req.body;

    // Validation
    if (!name || !dosage || !frequency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, dosage, and frequency are required'
      });
    }

    // Validate dates if provided
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid start date',
        message: 'Please provide a valid start date'
      });
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid end date',
        message: 'Please provide a valid end date'
      });
    }

    const medicines = readMedicines();
    
    // Check for duplicate medicine names (case-insensitive)
    const existingMedicine = medicines.find(med => 
      med.name.toLowerCase() === name.toLowerCase().trim() && med.active !== false
    );

    if (existingMedicine) {
      return res.status(409).json({
        success: false,
        error: 'Medicine already exists',
        message: `A medicine named "${name}" is already in your list`
      });
    }

    const newMedicine = {
      id: uuidv4(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      times: times || [],
      duration: duration?.trim() || '',
      prescribedBy: prescribedBy?.trim() || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      instructions: instructions?.trim() || '',
      sideEffects: sideEffects?.trim() || '',
      category: category?.trim() || 'General',
      active: active !== false,
      reminderEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doseTaken: [],
      missedDoses: 0
    };

    medicines.push(newMedicine);
    
    if (writeMedicines(medicines)) {
      res.status(201).json({
        success: true,
        data: newMedicine,
        message: 'Medicine added successfully'
      });
    } else {
      throw new Error('Failed to save medicine');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create medicine',
      message: error.message
    });
  }
});

// PUT /api/medicines/:id - Update medicine
router.put('/:id', (req, res) => {
  try {
    const medicines = readMedicines();
    const medicineIndex = medicines.findIndex(med => med.id === req.params.id);
    
    if (medicineIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found',
        message: `No medicine found with ID: ${req.params.id}`
      });
    }

    const { 
      name, 
      dosage, 
      frequency, 
      times, 
      duration, 
      prescribedBy, 
      startDate, 
      endDate,
      instructions,
      sideEffects,
      category,
      active,
      reminderEnabled
    } = req.body;

    // Validate dates if provided
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid start date',
        message: 'Please provide a valid start date'
      });
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid end date',
        message: 'Please provide a valid end date'
      });
    }

    // Update medicine
    const updatedMedicine = {
      ...medicines[medicineIndex],
      ...(name && { name: name.trim() }),
      ...(dosage && { dosage: dosage.trim() }),
      ...(frequency && { frequency: frequency.trim() }),
      ...(times && { times }),
      ...(duration !== undefined && { duration: duration.trim() }),
      ...(prescribedBy !== undefined && { prescribedBy: prescribedBy.trim() }),
      ...(startDate && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(instructions !== undefined && { instructions: instructions.trim() }),
      ...(sideEffects !== undefined && { sideEffects: sideEffects.trim() }),
      ...(category && { category: category.trim() }),
      ...(active !== undefined && { active }),
      ...(reminderEnabled !== undefined && { reminderEnabled }),
      updatedAt: new Date().toISOString()
    };

    medicines[medicineIndex] = updatedMedicine;
    
    if (writeMedicines(medicines)) {
      res.json({
        success: true,
        data: updatedMedicine,
        message: 'Medicine updated successfully'
      });
    } else {
      throw new Error('Failed to save updated medicine');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update medicine',
      message: error.message
    });
  }
});

// DELETE /api/medicines/:id - Delete medicine
router.delete('/:id', (req, res) => {
  try {
    const medicines = readMedicines();
    const medicineIndex = medicines.findIndex(med => med.id === req.params.id);
    
    if (medicineIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found',
        message: `No medicine found with ID: ${req.params.id}`
      });
    }

    const deletedMedicine = medicines.splice(medicineIndex, 1)[0];
    
    if (writeMedicines(medicines)) {
      res.json({
        success: true,
        data: deletedMedicine,
        message: 'Medicine deleted successfully'
      });
    } else {
      throw new Error('Failed to save after deletion');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete medicine',
      message: error.message
    });
  }
});

// POST /api/medicines/:id/dose - Mark dose as taken
router.post('/:id/dose', (req, res) => {
  try {
    const medicines = readMedicines();
    const medicineIndex = medicines.findIndex(med => med.id === req.params.id);
    
    if (medicineIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found',
        message: `No medicine found with ID: ${req.params.id}`
      });
    }

    const { timestamp, notes } = req.body;
    const doseTimestamp = timestamp || new Date().toISOString();

    const medicine = medicines[medicineIndex];
    
    if (!medicine.doseTaken) {
      medicine.doseTaken = [];
    }

    // Add dose record
    medicine.doseTaken.push({
      timestamp: doseTimestamp,
      notes: notes || '',
      date: new Date(doseTimestamp).toISOString().split('T')[0]
    });

    medicine.updatedAt = new Date().toISOString();
    
    if (writeMedicines(medicines)) {
      res.json({
        success: true,
        data: medicine,
        message: 'Dose marked as taken successfully'
      });
    } else {
      throw new Error('Failed to save dose record');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record dose',
      message: error.message
    });
  }
});

// GET /api/medicines/active - Get active medicines only
router.get('/filter/active', (req, res) => {
  try {
    const medicines = readMedicines();
    const activeMedicines = medicines
      .filter(med => med.active !== false)
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: activeMedicines,
      count: activeMedicines.length,
      message: 'Active medicines retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve active medicines',
      message: error.message
    });
  }
});

// GET /api/medicines/reminders - Get medicines with reminders due
router.get('/filter/reminders', (req, res) => {
  try {
    const medicines = readMedicines();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    
    const reminderMedicines = medicines
      .filter(med => med.active !== false && med.reminderEnabled)
      .filter(med => {
        if (!med.times || med.times.length === 0) return false;
        
        // Check if any reminder time is within the next 30 minutes
        return med.times.some(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const reminderTime = hours * 60 + minutes;
          const timeDiff = reminderTime - currentTime;
          
          // Reminder if within next 30 minutes or past due by up to 1 hour
          return timeDiff >= -60 && timeDiff <= 30;
        });
      });

    res.json({
      success: true,
      data: reminderMedicines,
      count: reminderMedicines.length,
      message: 'Reminder medicines retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve reminder medicines',
      message: error.message
    });
  }
});

module.exports = router;