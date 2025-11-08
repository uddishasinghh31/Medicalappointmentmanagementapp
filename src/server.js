// Health Sathi Backend Server
// Node.js + Express.js backend for Health Sathi application

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

// Import routes
const appointmentRoutes = require('./backend/routes/appointments');
const medicineRoutes = require('./backend/routes/medicines');
const documentRoutes = require('./backend/routes/documents');
const patientRoutes = require('./backend/routes/patient');
const healthRoutes = require('./backend/routes/health');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // React app URLs
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database directory exists
const dbPath = path.join(__dirname, 'backend', 'database');
fs.ensureDirSync(dbPath);

// Initialize database files if they don't exist
const initializeDatabase = () => {
  const dbFiles = [
    { name: 'appointments.json', default: [] },
    { name: 'medicines.json', default: [] },
    { name: 'documents.json', default: [] },
    { name: 'patients.json', default: [
      {
        id: '1',
        name: 'John Doe',
        age: 45,
        bloodType: 'A+',
        phone: '+1 (555) 123-4567',
        emergency: 'Jane Doe - +1 (555) 987-6543',
        email: 'john.doe@email.com',
        address: '123 Health St, Wellness City, HC 12345',
        dateCreated: new Date().toISOString()
      }
    ] }
  ];

  dbFiles.forEach(file => {
    const filePath = path.join(dbPath, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeJsonSync(filePath, file.default, { spaces: 2 });
      console.log(`✅ Created ${file.name} with default data`);
    }
  });
};

// Initialize database
initializeDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Health Sathi Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/health-data', healthRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🏥 Health Sathi Backend Server Starting...\n');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Database Path: ${dbPath}`);
  console.log('\n📋 Available Endpoints:');
  console.log('   - GET  /api/health');
  console.log('   - GET  /api/appointments');
  console.log('   - POST /api/appointments');
  console.log('   - GET  /api/medicines');
  console.log('   - POST /api/medicines');
  console.log('   - GET  /api/documents');
  console.log('   - POST /api/documents');
  console.log('   - GET  /api/patient');
  console.log('   - PUT  /api/patient');
  console.log('\n🚀 Backend is ready for Health Sathi frontend!\n');
});

module.exports = app;