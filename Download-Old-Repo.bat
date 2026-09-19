@echo off
title Clone Old NetCast AI Repo
color 0A
echo.
echo  ========================================================
echo     NetCast AI - Downloading Old Project from GitHub
echo  ========================================================
echo.

cd /d C:\

echo  Cloning repository...
git clone https://github.com/logith2006/NETCAST-AI.git C:\NetCast-AI-OldRepo

echo.
echo  Download complete! The old project is now in C:\NetCast-AI-OldRepo
echo.
pause
