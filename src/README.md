# Health Sathi - Complete Healthcare Management System

A comprehensive, full-stack medical appointment and health management application built with **React + Node.js + Express.js**.

## 🏥 About Health Sathi

Health Sathi is your trusted digital health companion designed to simplify healthcare management for users of all ages, with special consideration for elderly users who need larger, more visible interface elements.

### ✨ Key Features

**🏠 Smart Dashboard**
- Real-time health overview with live backend data
- Upcoming appointments and medicine reminders
- Health analytics and trends
- Emergency contact quick access

**📅 Appointment Management**
- Schedule, update, and cancel appointments
- Doctor and specialty tracking
- Appointment history and status updates
- Automatic conflict detection

**💊 Medicine Management**
- Add medications with dosage and timing
- Smart reminder system with multiple daily doses
- Dose tracking and adherence monitoring
- Side effect and interaction warnings

**📄 Document Organization**
- Upload and store medical documents
- Categorize reports, prescriptions, and records
- Search and filter capabilities
- Secure file downloads

**🤖 AI Health Assistant (Nurse Sarah)**
- 24/7 intelligent health chatbot
- Symptom assessment and guidance
- Emergency protocol assistance
- Context-aware health recommendations

**📊 Health Analytics**
- Vital signs tracking (BP, heart rate, weight)
- Medicine adherence reports
- Health trend visualization
- Progress monitoring

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS V4** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Fetch API** - Backend communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin support
- **Multer** - File upload handling
- **JSON File Database** - Simple data persistence
- **UUID** - Unique ID generation

### Features
- **Full CRUD Operations** - Create, Read, Update, Delete
- **File Upload System** - Document management
- **REST API** - Clean API design
- **Error Handling** - Comprehensive error management
- **Data Validation** - Input sanitization
- **Real-time Updates** - Live data synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org)
- npm (comes with Node.js)

### ⚡ Quick Start

**Fastest way to get started:**

1. **Download/Clone the Health Sathi folder**

2. **Double-click the startup file:**
   - **Windows:** Double-click `start.bat`
   - **Mac/Linux:** Double-click `start.sh` (or run `chmod +x start.sh && ./start.sh`)

3. **Wait for servers to start**, then open: http://localhost:3000

### 🔧 Manual Installation

1. **Open terminal in the Health Sathi folder**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start both servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:5000
   - **Health Check:** http://localhost:5000/api/health
   - **Connection Tester:** http://localhost:3000/health-check.html

### 🚨 Fixing "Backend Not Available" Errors

If you see connection errors:

1. **Ensure Node.js is installed:** `node --version`
2. **Install dependencies:** `npm install`
3. **Start both servers:** `npm run dev`
4. **Wait for this output:**
   ```
   🏥 Health Sathi Backend Server Starting...
   ✅ Server running on port 5000
   webpack compiled successfully!
   ```
5. **Refresh your browser**

### 📋 Alternative Start Methods

**Start backend only:**
```bash
npm run server
```

**Start frontend only:**
```bash
npm run client
```

**Production build:**
```bash
npm run build
npm start
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `/api`

### Endpoints

#### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment
- `GET /appointments/filter/upcoming` - Get upcoming appointments

#### Medicines
- `GET /medicines` - Get all medicines
- `POST /medicines` - Add new medicine
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine
- `POST /medicines/:id/dose` - Mark dose as taken
- `GET /medicines/filter/active` - Get active medicines

#### Documents
- `GET /documents` - Get all documents
- `POST /documents` - Upload new document (multipart/form-data)
- `PUT /documents/:id` - Update document metadata
- `DELETE /documents/:id` - Delete document
- `GET /documents/download/:id` - Download document file

#### Patient Profile
- `GET /patient` - Get patient profile
- `PUT /patient` - Update patient profile
- `POST /patient` - Create patient profile

#### Health Data
- `GET /health-data/dashboard` - Get dashboard summary
- `GET /health-data/vitals` - Get vital signs
- `POST /health-data/vitals` - Record vital signs
- `GET /health-data/analytics` - Get health analytics

## 📁 Project Structure

```
health-sathi/
├── public/                 # Static files
├── src/                   # React frontend source
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── EnhancedHealthChatbot.tsx  # AI assistant
│   └── ui/               # Reusable UI components
├── services/             # API service layer
│   └── api.js           # Backend communication
├── backend/             # Node.js backend
│   ├── routes/          # API routes
│   │   ├── appointments.js
│   │   ├── medicines.js
│   │   ├── documents.js
│   │   ├── patient.js
│   │   └── health.js
│   ├── database/        # JSON file database
│   └── uploads/         # Uploaded files
├── styles/              # CSS and styling
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # This file
```

## 🗄 Database Schema

### Appointments
```json
{
  "id": "uuid",
  "doctor": "string",
  "specialty": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "status": "scheduled|completed|cancelled",
  "notes": "string",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### Medicines
```json
{
  "id": "uuid",
  "name": "string",
  "dosage": "string",
  "frequency": "string",
  "times": ["HH:MM"],
  "active": boolean,
  "reminderEnabled": boolean,
  "prescribedBy": "string",
  "instructions": "string",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### Documents
```json
{
  "id": "uuid",
  "name": "string",
  "type": "string",
  "category": "string",
  "date": "YYYY-MM-DD",
  "doctor": "string",
  "fileName": "string",
  "originalName": "string",
  "fileSize": number,
  "mimeType": "string",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
NODE_ENV=development
PORT=5000
DB_PATH=./backend/database
UPLOAD_PATH=./backend/uploads
MAX_FILE_SIZE=10485760
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### Package.json Scripts
- `npm start` - Start production server
- `npm run dev` - Start both frontend and backend in development
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server
- `npm run build` - Build frontend for production

## 🎨 Design Features

### Accessibility
- Large, readable fonts for elderly users
- High contrast color schemes
- Simple, intuitive navigation
- Voice input simulation in chatbot
- Keyboard navigation support

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid layouts
- Touch-friendly interface

### User Experience
- Loading states and error handling
- Real-time data updates
- Offline capability considerations
- Progressive web app ready

## 🚨 Health & Safety

### Important Notes
- **Not for Medical Emergencies**: Always call emergency services (911) for urgent medical situations
- **Consultation Required**: This app supplements but does not replace professional medical advice
- **Privacy Focused**: Data is stored locally and designed for personal use
- **No PII Collection**: Designed to minimize collection of personally identifiable information

### Emergency Features
- Quick access to emergency contacts
- Emergency protocol guidance in chatbot
- One-click emergency service dialing
- Medical information summary for emergencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by Lucide React
- UI components inspired by ShadCN/UI
- Health guidance based on general medical knowledge
- Designed with accessibility and elderly users in mind

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**Health Sathi** - Your trusted digital health companion since 2025 💚

*Always consult with healthcare professionals for medical advice*