@echo off
title NetCast AI - Full Project Setup
color 0B
echo.
echo  ========================================================
echo     NetCast AI - Copying Frontend to Full Project
echo  ========================================================
echo.

set SRC="C:\NetCast-AI\netcast-ai"
set DEST="C:\Users\logit\.gemini\antigravity\scratch\NetCast-AI-FullProject\netcast-ai"

if not exist %DEST% (
    mkdir %DEST%
)

echo  Copying files... Please wait.
xcopy %SRC% %DEST% /E /I /Y /Q

echo.
echo  Copy complete!
echo.
echo  Now you can follow the 3 steps to start the Full Stack App:
echo  1. Start MongoDB
echo  2. Start Backend (in netcast-node-backend)
echo  3. Start Frontend (in netcast-ai)
echo.
pause
