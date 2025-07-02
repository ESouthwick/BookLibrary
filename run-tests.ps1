# BookLibrary Test Runner Script
# This script runs all tests for both backend and frontend

Write-Host "🚀 Running BookLibrary Tests..." -ForegroundColor Green
Write-Host ""

# Run Backend Tests
Write-Host "📚 Running Backend API Tests..." -ForegroundColor Yellow
try {
    Set-Location "backend/BookLibraryApi.Tests"
    dotnet test --verbosity normal
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend tests passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend tests failed!" -ForegroundColor Red
        $backendFailed = $true
    }
} catch {
    Write-Host "❌ Error running backend tests: $_" -ForegroundColor Red
    $backendFailed = $true
} finally {
    Set-Location "../.."
}

Write-Host ""

# Run Frontend Tests
Write-Host "⚛️  Running Frontend React Tests..." -ForegroundColor Yellow
try {
    Set-Location "frontend"
    
    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
        npm install
    }
    
    npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend tests passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend tests failed!" -ForegroundColor Red
        $frontendFailed = $true
    }
} catch {
    Write-Host "❌ Error running frontend tests: $_" -ForegroundColor Red
    $frontendFailed = $true
} finally {
    Set-Location ".."
}

Write-Host ""

# Summary
Write-Host "📊 Test Summary:" -ForegroundColor Cyan
if ($backendFailed -or $frontendFailed) {
    Write-Host "❌ Some tests failed!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host "🎉 BookLibrary is ready for production!" -ForegroundColor Green
} 