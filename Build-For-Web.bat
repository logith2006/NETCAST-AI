@echo off
title Build NetCast AI for Web
color 0E
echo.
echo  ========================================================
echo     NetCast AI - Building Website for Internet Deployment
echo  ========================================================
echo.

cd /d C:\NetCast-AI\netcast-ai

echo  Building your project (Please wait a minute)...
cmd /c npm run build

echo.
echo  ========================================================
echo  Build Complete! 
echo  A new folder named "dist" has been created inside C:\NetCast-AI\netcast-ai
echo.
echo  HOW TO MAKE IT LIVE:
echo  1. Open Chrome and go to: https://app.netlify.com/drop
echo  2. Open your File Explorer and go to C:\NetCast-AI\netcast-ai
echo  3. Drag the "dist" folder and drop it onto the Netlify webpage!
echo  ========================================================
pause
