@echo off
title Refactor NetCast AI Pages
color 0E
echo.
echo  ========================================================
echo     NetCast AI - Refactoring Dashboard into Pages
echo  ========================================================
echo.

cd /d C:\NetCast-AI

echo  Running refactoring script...
node refactorPages.js

echo.
echo  Refactoring complete! Check your browser.
pause
