# 🚀 Quick Start Guide - Health Sathi

## ⚡ Fastest Way to Start

### Windows Users:
1. Double-click `start.bat` file
2. Wait for both servers to start
3. Open http://localhost:3000 in your browser

### Mac/Linux Users:
1. Double-click `start.sh` file (or run `chmod +x start.sh && ./start.sh` in terminal)
2. Wait for both servers to start  
3. Open http://localhost:3000 in your browser

### Manual Start (All Platforms):
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

## 🔍 Troubleshooting Connection Errors

### Error: "Backend server is not available"

**Solution**: The Node.js backend server needs to be running alongside the React frontend.

#### Step-by-Step Fix:

1. **Check if Node.js is installed:**
   ```bash
   node --version
   npm --version
   ```
   If not installed, download from [nodejs.org](https://nodejs.org)

2. **Open terminal/command prompt in your Health Sathi folder**

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start both servers:**
   ```bash
   npm run dev
   ```

5. **You should see output like:**
   ```
   🏥 Health Sathi Backend Server Starting...
   ✅ Server running on port 5000
   📊 Health Check: http://localhost:5000/api/health
   
   webpack compiled successfully!
   Local: http://localhost:3000
   ```

6. **Open your browser to:**
   - Frontend: http://localhost:3000
   - Backend Health Check: http://localhost:5000/api/health

## ✅ Success Indicators

### When Working Correctly:
- ✅ No yellow warning banner in the app
- ✅ Green "🟢 Live Data" badges on pages
- ✅ Data persists when you refresh the page
- ✅ Adding appointments/medicines works

### When Backend is Disconnected:
- ⚠️ Yellow warning banner appears
- 🔄 "Retry Connection" button available
- 📱 App works in "offline mode"
- ❌ Data doesn't persist between refreshes

## 🔧 Alternative Start Methods

### Start Backend Only:
```bash
npm run server
```

### Start Frontend Only:
```bash
npm run client
```

### Production Build:
```bash
npm run build
npm start
```

## 📱 Using the App

Once both servers are running:

1. **Dashboard** - Overview of your health data
2. **Appointments** - Schedule and manage doctor visits
3. **Medicines** - Track medications and set reminders
4. **Documents** - Upload and store medical files
5. **Profile** - Manage patient information

## 🆘 Still Having Issues?

1. **Port Already in Use Error:**
   ```bash
   # Kill processes on ports 3000 and 5000 (Mac/Linux)
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Permission Errors:**
   ```bash
   # Mac/Linux - Fix permissions
   sudo chown -R $(whoami) ~/.npm
   
   # Or try with admin rights
   sudo npm install
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

4. **Check firewall/antivirus:**
   - Allow Node.js through firewall
   - Temporarily disable antivirus
   - Check localhost isn't blocked

## 📞 Success Checklist

✅ Node.js installed (v14+)  
✅ Dependencies installed (`npm install`)  
✅ Both servers running (`npm run dev`)  
✅ Frontend loads at http://localhost:3000  
✅ Backend responds at http://localhost:5000/api/health  
✅ No yellow warning banner in app  
✅ Green "Live Data" badges visible  

**Your Health Sathi app is ready! 🏥💚**

---

*Need more help? Check the detailed STARTUP_GUIDE.md file*