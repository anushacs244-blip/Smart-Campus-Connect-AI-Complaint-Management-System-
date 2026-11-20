@echo off
setlocal enabledelayedexpansion
title Campus Connect - Android Emulator Launcher
color 0b

echo ========================================================
echo       Campus Connect - Android Studio Emulator Launcher
echo                  Developed by SPA
echo ========================================================
echo.

:: 1. Ensure Backend Server is Running
echo [1/4] Checking Node.js Backend Server (Port 5000)...
netstat -ano | findstr :5000 | findstr LISTENING >nul
if !errorlevel! neq 0 (
    echo Starting Backend Server on port 5000 in background...
    start "Campus Connect - Backend API" cmd /k "cd server && npm start"
    timeout /t 3 >nul
) else (
    echo Backend Server is already running on port 5000!
)

:: 2. Locate Android SDK tools
set "ADB_PATH="
if exist "C:\Android\Sdk\platform-tools\adb.exe" set "ADB_PATH=C:\Android\Sdk\platform-tools\adb.exe"
if not defined ADB_PATH if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" set "ADB_PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if not defined ADB_PATH set "ADB_PATH=adb"

set "EMULATOR_PATH="
if exist "C:\Android\Sdk\emulator\emulator.exe" set "EMULATOR_PATH=C:\Android\Sdk\emulator\emulator.exe"
if not defined EMULATOR_PATH if exist "%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe" set "EMULATOR_PATH=%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe"
if not defined EMULATOR_PATH set "EMULATOR_PATH=emulator"

:: 3. Check for running emulator or connected device
echo.
echo [2/4] Checking for running Android emulator...
"%ADB_PATH%" devices | findstr /i "emulator" | findstr /i "device" >nul
if !errorlevel! neq 0 (
    echo No running emulator detected. Looking for installed AVDs...
    set "AVD_NAME="
    for /f "tokens=*" %%a in ('"%EMULATOR_PATH%" -list-avds 2^>nul') do (
        if not defined AVD_NAME set "AVD_NAME=%%a"
    )
    if defined AVD_NAME (
        echo Launching Android Emulator: !AVD_NAME!...
        start "" "%EMULATOR_PATH%" -avd !AVD_NAME!
        echo Waiting for emulator to connect...
        "%ADB_PATH%" wait-for-device
        timeout /t 8 >nul
    ) else (
        echo Please open Android Studio and start your emulator from Virtual Device Manager!
    )
) else (
    echo Active Android emulator detected!
)

:: 4. Install pre-built APK onto the emulator
echo.
echo [3/4] Installing Campus Connect APK to emulator...
if exist "CampusConnect-App.apk" (
    "%ADB_PATH%" install -r "CampusConnect-App.apk"
    if !errorlevel! equ 0 (
        echo APK installed successfully!
        echo.
        echo [4/4] Launching Campus Connect on the Emulator...
        "%ADB_PATH%" shell am start -n com.example.campusconnect_flutter/.MainActivity
        echo.
        echo ========================================================
        echo SUCCESS: Campus Connect is running on your Emulator!
        echo Connected to Backend: http://10.0.2.2:5000/api
        echo ========================================================
    ) else (
        echo Installation via script skipped or failed.
        echo TIP: You can simply drag and drop CampusConnect-App.apk
        echo      directly into your running Android Emulator window!
    )
) else (
    echo CampusConnect-App.apk not found in root directory.
)

echo.
echo ========================================================
echo How to run & debug from Android Studio:
echo 1. Open Android Studio
echo 2. Click File -^> Open -^> Select the folder:
echo    "%~dp0flutter_client"
echo 3. In the device dropdown, pick your Android Emulator
echo 4. Click the Green 'Run' (Play) button!
echo ========================================================
echo.
pause
