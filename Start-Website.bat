@echo off
title Connective AI - Website Server
color 0B
echo.
echo  ========================================================
echo     Connective AI - Website Live Server
echo  ========================================================
echo.
echo  Starting local web server...
echo.

cd /d C:\NetCast-AI\netcast-ai

echo  Starting Vite server...
start http://localhost:5173
call npm run dev

pause
