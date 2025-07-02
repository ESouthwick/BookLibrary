# BookLibrary Concurrent App Runner Script
# This script runs both the backend API and frontend development server concurrently

Write-Host "Starting BookLibrary Applications..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$rootDir = Get-Location

# Check if database exists, if not run migrations
if (-not (Test-Path "backend/BookLibraryApi/books.db")) {
    Write-Host "Running database migrations..." -ForegroundColor Cyan
    Set-Location "backend/BookLibraryApi"
    dotnet ef database update
    Set-Location $rootDir
}

# Check if frontend dependencies exist, if not install them
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location "frontend"
    npm install
    Set-Location $rootDir
}

Write-Host "Starting both applications concurrently..." -ForegroundColor Cyan
Write-Host ""

# Start backend API in a new PowerShell window
Write-Host "Starting Backend API in new window..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend\BookLibraryApi'; dotnet run"

# Start frontend development server in a new PowerShell window
Write-Host "Starting Frontend Development Server in new window..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host "Both applications are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:5086 or https://localhost:7226" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Swagger: http://localhost:5086/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
Write-Host ""

# Wait for user input
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 