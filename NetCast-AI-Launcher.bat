@echo off
title NetCast AI - Auto Launcher
color 0A
echo ============================================
echo    NetCast AI - Starting All Services...
echo ============================================
echo.

:: Step 1: Install Backend Dependencies & Start Server
echo [1/3] Installing & Starting Backend Server...
start /min "NetCast-Backend" cmd /k "cd /d C:\NetCast-AI\netcast-node-backend && npm install && npm start"

:: Wait 15 seconds for install + MongoDB connection
echo      Waiting for backend to be ready...
timeout /t 15 /nobreak >nul

:: Step 2: Install Frontend Dependencies & Start Dev Server
echo [2/3] Installing & Starting Frontend Server...
start /min "NetCast-Frontend" cmd /k "cd /d C:\NetCast-AI\netcast-ai && npm install && npm run dev"

:: Wait 15 seconds for install + Vite to start
echo      Waiting for frontend to be ready...
timeout /t 15 /nobreak >nul

:: Step 3: Open Chrome
echo [3/3] Opening Chrome...
start "" "chrome" "http://localhost:5173"

echo.
echo ============================================
echo    NetCast AI is LIVE! Browser opening...
echo ============================================
echo.
echo (You can close this window)
timeout /t 3 /nobreak >nul
exit
