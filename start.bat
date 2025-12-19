@echo off
echo Starting E-commerce Admin Panel...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers are starting in separate windows...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
