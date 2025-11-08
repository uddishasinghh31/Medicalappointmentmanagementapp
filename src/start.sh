#!/bin/bash

echo "🏥 Starting Health Sathi Application..."
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Starting both frontend and backend servers..."
    echo "✅ Frontend will be available at: http://localhost:3000"
    echo "✅ Backend API will be available at: http://localhost:5000"
    echo ""
    echo "Press Ctrl+C to stop the servers"
    echo ""
    npm run dev
else
    echo "❌ Failed to install dependencies. Please check your Node.js installation."
    exit 1
fi