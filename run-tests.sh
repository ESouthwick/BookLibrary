#!/bin/bash

# BookLibrary Test Runner Script
# This script runs all tests for both backend and frontend

echo "🚀 Running BookLibrary Tests..."
echo ""

# Run Backend Tests
echo "📚 Running Backend API Tests..."
cd backend/BookLibraryApi.Tests
if dotnet test --verbosity normal; then
    echo "✅ Backend tests passed!"
    backend_failed=false
else
    echo "❌ Backend tests failed!"
    backend_failed=true
fi
cd ../..

echo ""

# Run Frontend Tests
echo "⚛️  Running Frontend React Tests..."
cd frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if npm test; then
    echo "✅ Frontend tests passed!"
    frontend_failed=false
else
    echo "❌ Frontend tests failed!"
    frontend_failed=true
fi
cd ..

echo ""

# Summary
echo "📊 Test Summary:"
if [ "$backend_failed" = true ] || [ "$frontend_failed" = true ]; then
    echo "❌ Some tests failed!"
    exit 1
else
    echo "✅ All tests passed!"
    echo "🎉 BookLibrary is ready for production!"
fi 