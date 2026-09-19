@echo off
title Update Dashboard with Real Services
color 0A
echo.
echo  ========================================================
echo     NetCast AI - Integrating Real KPI & Weather APIs
echo  ========================================================
echo.

cd /d C:\NetCast-AI

echo  Running updater script...
node updateDashboardReal.js

echo.
echo  Process complete! You can now check the browser.
pause
