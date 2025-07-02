#!/bin/bash

# BookLibrary Concurrent App Runner Script
# This script runs both the backend API and frontend development server concurrently

echo "🚀 Starting BookLibrary Applications..."
echo ""

# Function to start backend API
start_backend_api() {
    echo "📚 Starting Backend API..."
    cd backend/BookLibraryApi
    
    # Check if database exists, if not run migrations
    if [ ! -f "books.db" ]; then
        echo "🗄️  Running database migrations..."
        dotnet ef database update
    fi
    
    echo "🌐 Backend API will be available at: http://localhost:5086 or https://localhost:7226"
    echo "📖 Swagger documentation: http://localhost:5086/swagger"
    echo ""
    
    # Start the backend API
    dotnet run
}

# Function to start frontend development server
start_frontend_dev() {
    echo "⚛️  Starting Frontend Development Server..."
    cd frontend
    
    # Check if node_modules exists, if not install dependencies
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    echo "🌐 Frontend will be available at: http://localhost:5173"
    echo ""
    
    # Start the frontend development server
    npm run dev
}

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping applications..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Applications stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🔄 Starting both applications concurrently..."
echo ""

# Start backend in background
start_backend_api &
BACKEND_PID=$!

# Start frontend in background
start_frontend_dev &
FRONTEND_PID=$!

echo "✅ Both applications are starting..."
echo "📚 Backend API: http://localhost:5086"
echo "⚛️  Frontend: http://localhost:5173"
echo "📖 Swagger: http://localhost:5086/swagger"
echo ""
echo "Press Ctrl+C to stop both applications"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 