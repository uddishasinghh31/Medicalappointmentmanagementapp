# 🚀 Health Sathi Startup Guide

## Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application

#### Option A: Start Both Frontend and Backend Together (Recommended)
```bash
npm run dev
```
This command starts:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

#### Option B: Start Separately (Advanced)
```bash
# Terminal 1 - Start Backend Server
npm run server

# Terminal 2 - Start Frontend App  
npm run client
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📋 What to Expect

### ✅ When Backend is Connected
- Green "🟢 Live Data" indicators on all pages
- Real-time data persistence 
- All CRUD operations work
- File upload functionality active
- Data survives page refreshes

### ⚠️ When Backend is Disconnected
- Yellow warning banner appears
- "Offline Mode" with empty data
- Basic UI functionality still works
- No data persistence
- "Retry" button to reconnect

## 🔧 Troubleshooting

### Backend Connection Issues

**Problem**: `TypeError: api.testConnection is not a function`
**Solution**: Make sure you've installed all dependencies:
```bash
npm install
```

**Problem**: "Backend server is not available"
**Solution**: Start the backend server:
```bash
npm run server
```

**Problem**: "Port 5000 already in use"
**Solution**: Kill the process on port 5000:
```bash
# On Mac/Linux
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### File Upload Issues

**Problem**: Document uploads fail
**Solution**: Check that the `backend/uploads` directory exists and has write permissions.

### Database Issues

**Problem**: Data not saving
**Solution**: Check that the `backend/database` directory exists and contains JSON files.

## 📁 Backend File Structure
```
backend/
├── database/
│   ├── appointments.json    # Appointments data
│   ├── medicines.json       # Medicines data
│   ├── documents.json       # Document metadata
│   ├── patients.json        # Patient profiles
│   └── vitals.json          # Health measurements
└── uploads/                 # Uploaded files
```

## 🔍 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Appointments
- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Medicines  
- `GET /api/medicines` - List all medicines
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Remove medicine

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload new document
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document

### Patient Profile
- `GET /api/patient` - Get patient profile
- `PUT /api/patient` - Update patient profile

## ⚡ Performance Tips

1. **Keep Backend Running**: Leave the backend server running to avoid connection delays
2. **Database Size**: JSON files are loaded into memory - keep data reasonable
3. **File Uploads**: Large files are stored in `backend/uploads/` directory
4. **Browser Cache**: Clear cache if you see old data after updates

## 🔒 Security Notes

- This is a **local development setup**
- Data is stored in local JSON files
- No authentication/authorization implemented
- **Not suitable for production use**
- For production, consider:
  - PostgreSQL/MySQL database
  - User authentication
  - HTTPS encryption
  - Data validation and sanitization

## 🆘 Need Help?

1. Check the browser console for error messages
2. Check the terminal where you started the servers
3. Verify both frontend (3000) and backend (5000) are running
4. Try the "Retry" button in the app if connection fails
5. Restart both servers if issues persist

## 📝 Development Scripts

```bash
npm start          # Production server
npm run dev        # Development (both servers)
npm run server     # Backend only
npm run client     # Frontend only
npm run build      # Build for production
```

---

**Happy Health Tracking! 💚**

*Remember: This app is for personal health management and should not replace professional medical advice.*