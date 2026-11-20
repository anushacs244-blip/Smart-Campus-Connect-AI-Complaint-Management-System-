@echo off
title Smart Campus Connect - Developed by SPA
color 0b

echo ========================================================
echo        Smart Campus Connect - AI & Complaint Portal
echo                  Developed by SPA
echo ========================================================
echo.

echo [1/3] Checking environment...
if not exist "server\node_modules\" (
    echo Installing server dependencies...
    cd server && call npm install && cd ..
)
if not exist "client\node_modules\" (
    echo Installing client dependencies...
    cd client && call npm install && cd ..
)

echo.
echo [2/3] Starting Backend Server (Port 5000)...
start "Smart Campus Connect - Backend (SPA)" cmd /k "cd server && npm start"

echo.
echo [3/3] Starting Frontend Client (Port 5173)...
start "Smart Campus Connect - Frontend (SPA)" cmd /k "cd client && npm run dev"

timeout /t 3 >nul

echo.
echo ========================================================
echo Smart Campus Connect is running!
echo Web Frontend:    http://localhost:5173
echo Backend API:     http://localhost:5000
echo Flutter/Dart UI: Available in flutter_client\ (cd flutter_client && flutter run)
echo Default Admin:   spa@campusconnect.com / admin123
echo Demo Student:    student@campus.edu / admin123
echo ========================================================
start http://localhost:5173
pause
