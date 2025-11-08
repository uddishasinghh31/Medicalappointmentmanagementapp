@echo off
echo Starting Health Sathi Application...
echo.
echo Installing dependencies...
npm install
echo.
echo Starting both frontend and backend servers...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
npm run dev
pause