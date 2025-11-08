#!/usr/bin/env node

/**
 * Health Sathi - Setup Checker
 * This script checks if all requirements are met to run the application
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('\n🏥 Health Sathi - System Setup Checker\n');
console.log('='.repeat(50));

let hasErrors = false;
let hasWarnings = false;

// Check Node.js version
console.log('\n📦 Checking Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));

if (majorVersion >= 14) {
  console.log(`✅ Node.js ${nodeVersion} (Required: v14+)`);
} else {
  console.log(`❌ Node.js ${nodeVersion} (Required: v14 or higher)`);
  console.log('   Download from: https://nodejs.org');
  hasErrors = true;
}

// Check npm
console.log('\n📦 Checking npm...');
exec('npm --version', (error, stdout) => {
  if (!error) {
    console.log(`✅ npm ${stdout.trim()}`);
  } else {
    console.log('❌ npm not found');
    hasErrors = true;
  }
});

// Check required files
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'server.js',
  'App.tsx',
  'public/index.html',
  'src/index.tsx',
  '.env'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check backend routes
console.log('\n📁 Checking backend routes...');
const requiredRoutes = [
  'backend/routes/appointments.js',
  'backend/routes/medicines.js',
  'backend/routes/documents.js',
  'backend/routes/patient.js',
  'backend/routes/health.js'
];

requiredRoutes.forEach(route => {
  const routePath = path.join(__dirname, route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} - MISSING`);
    hasErrors = true;
  }
});

// Check node_modules
console.log('\n📦 Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules folder exists');
  
  // Check critical dependencies
  const criticalDeps = ['express', 'react', 'react-dom', 'cors'];
  criticalDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✅ ${dep} installed`);
    } else {
      console.log(`❌ ${dep} - NOT INSTALLED`);
      hasWarnings = true;
    }
  });
} else {
  console.log('❌ node_modules folder not found');
  console.log('   Run: npm install');
  hasErrors = true;
}

// Check database directory
console.log('\n📁 Checking database setup...');
const dbPath = path.join(__dirname, 'backend', 'database');
if (fs.existsSync(dbPath)) {
  console.log('✅ Database directory exists');
} else {
  console.log('⚠️  Database directory will be created on first run');
  hasWarnings = true;
}

// Check uploads directory
console.log('\n📁 Checking uploads directory...');
const uploadsPath = path.join(__dirname, 'backend', 'uploads');
if (fs.existsSync(uploadsPath)) {
  console.log('✅ Uploads directory exists');
} else {
  console.log('⚠️  Uploads directory will be created on first run');
  hasWarnings = true;
}

// Check ports
console.log('\n🔌 Checking ports...');
const net = require('net');

const checkPort = (port, name) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${port} (${name}) is in use`);
        console.log(`   Something is already running on this port`);
        hasWarnings = true;
      }
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`✅ Port ${port} (${name}) is available`);
      resolve(true);
    });
    
    server.listen(port);
  });
};

Promise.all([
  checkPort(3000, 'Frontend'),
  checkPort(5000, 'Backend')
]).then(() => {
  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');
  
  if (hasErrors) {
    console.log('❌ ERRORS FOUND - Please fix the errors above before running the app');
    console.log('\n🔧 Quick fix:');
    console.log('   1. Install Node.js v14+ from https://nodejs.org');
    console.log('   2. Run: npm install');
    console.log('   3. Run this checker again: node check-setup.js');
  } else if (hasWarnings) {
    console.log('⚠️  WARNINGS FOUND - The app should work, but check warnings above');
    console.log('\n✅ You can still try to run the app:');
    console.log('   npm install');
    console.log('   npm run dev');
  } else {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('\n🚀 Your system is ready to run Health Sathi!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm install (if not done already)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:3000');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});
