# Start E-commerce Admin Panel
# This script starts both backend and frontend servers

Write-Host "Starting E-commerce Admin Panel..." -ForegroundColor Green

# Start backend server in a new PowerShell window
Write-Host "Starting backend server on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in a new PowerShell window
Write-Host "Starting frontend server on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`nServers are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
