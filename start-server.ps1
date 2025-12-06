# TuneTogether - Local Test Server Script
# Quickly start a local server to test your app

Write-Host "🎵 TuneTogether - Local Test Server" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if config.js exists
if (-not (Test-Path config.js)) {
    Write-Host "⚠️  config.js not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item config.template.js config.js
    Write-Host "✅ config.js created" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Note: The app will work in demo mode." -ForegroundColor Yellow
    Write-Host "   To enable full features, edit config.js with your API keys." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Starting local server..." -ForegroundColor Green
Write-Host ""

# Try different methods to start a server

# Method 1: Python 3
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Starting server with Python..." -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Open your browser and visit:" -ForegroundColor Cyan
    Write-Host "   http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    python -m http.server 8080
}
# Method 2: Node.js http-server
elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "✅ Starting server with Node.js..." -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Open your browser and visit:" -ForegroundColor Cyan
    Write-Host "   http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    npx http-server -p 8080
}
# Method 3: VS Code Live Server suggestion
else {
    Write-Host "❌ No suitable server tool found." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Python (Recommended):" -ForegroundColor Cyan
    Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2 - Node.js:" -ForegroundColor Cyan
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 - VS Code Live Server:" -ForegroundColor Cyan
    Write-Host "  1. Open this folder in VS Code" -ForegroundColor White
    Write-Host "  2. Install 'Live Server' extension" -ForegroundColor White
    Write-Host "  3. Right-click index.html" -ForegroundColor White
    Write-Host "  4. Select 'Open with Live Server'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or simply open index.html directly in your browser!" -ForegroundColor Green
}
