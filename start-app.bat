@echo off
title SmartFoodPop - Dev Server Launcher
cd /d "%~dp0"
echo Starting SmartFoodPop Backend and Frontend...
node run-dev.js
pause
