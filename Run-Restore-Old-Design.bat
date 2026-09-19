@echo off
title Restore Old Design
color 0E
echo.
echo  ========================================================
echo     NetCast AI - Restoring Old Design from GitHub
echo  ========================================================
echo.

cd /d C:\NetCast-AI

echo  Starting download and restore process...
node RestoreOldDesign.js

echo.
pause
