@echo off
title Connective AI - Mobile App Builder
color 0D
echo.
echo  ========================================================
echo     Connective AI - Android Mobile App Builder
echo  ========================================================
echo.
echo  This script will convert your Connective app 
echo  into a REAL Android Mobile App (.apk)
echo.
echo  ========================================================
echo.

cd /d C:\NetCast-AI\netcast-ai

echo  [Step 1/5] Installing all dependencies...
echo  (This may take 2-3 minutes on first run)
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Failed to install dependencies!
    pause
    exit /b %errorlevel%
)
echo.
echo  [Step 1/5] DONE!
echo.

echo  [Step 2/5] Building the Web App for Mobile...
call npx vite build
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Failed to build web app!
    pause
    exit /b %errorlevel%
)
echo.
echo  [Step 2/5] DONE!
echo.

echo  [Step 3/5] Initializing Capacitor...
call npx cap init "Connective" "com.connective.app" --web-dir dist 2>nul
echo  [Step 3/5] DONE!
echo.

echo  [Step 4/5] Adding Android Platform...
if not exist "android\" (
    call npx cap add android
) else (
    echo  Android platform already exists. Skipping...
)
echo.
echo  [Step 4/5] DONE!
echo.

echo  [Step 5/5] Syncing Web Assets to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Failed to sync!
    pause
    exit /b %errorlevel%
)
echo.
echo  [Step 5/5] DONE!
echo.

echo  ========================================================
echo.
echo     SUCCESS! Your Android Project is READY!
echo.
echo  ========================================================
echo.
echo  Your Android project is at:
echo  C:\NetCast-AI\netcast-ai\android
echo.
echo  NEXT STEPS:
echo  1. Open Android Studio
echo  2. Click "Open" and select: C:\NetCast-AI\netcast-ai\android
echo  3. Wait for Gradle sync to finish
echo  4. Click "Build" then "Build Bundle / APK" then "Build APK"
echo  5. Your .apk file will appear in android\app\build\outputs\apk\
echo.
pause
