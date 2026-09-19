@echo off
title Apply New Dashboard Features
color 0E
echo.
echo  ========================================================
echo     NetCast AI - Injecting New Features into Dashboard
echo  ========================================================
echo.

cd /d C:\NetCast-AI

echo  Applying code injections...
node injectFeatures.js

echo.
echo  Process complete! You can now check the browser.
pause
