@echo off
title NetCast AI - Cleanup Unwanted Files
color 0C
echo ============================================
echo   NetCast AI - Removing Unwanted Files...
echo ============================================
echo.

:: Delete old repo folder
echo [1/12] Deleting NETCAST-AI-main folder...
if exist "C:\NetCast-AI\NETCAST-AI-main" (
    rmdir /s /q "C:\NetCast-AI\NETCAST-AI-main"
    echo        DELETED: NETCAST-AI-main
) else (
    echo        SKIPPED: NETCAST-AI-main not found
)

:: Delete repo zip
echo [2/12] Deleting repo.zip...
if exist "C:\NetCast-AI\repo.zip" (
    del /f /q "C:\NetCast-AI\repo.zip"
    echo        DELETED: repo.zip
) else (
    echo        SKIPPED: repo.zip not found
)

:: Delete JS scripts
echo [3/12] Deleting injectFeatures.js...
if exist "C:\NetCast-AI\injectFeatures.js" (
    del /f /q "C:\NetCast-AI\injectFeatures.js"
    echo        DELETED: injectFeatures.js
) else ( echo        SKIPPED )

echo [4/12] Deleting refactorPages.js...
if exist "C:\NetCast-AI\refactorPages.js" (
    del /f /q "C:\NetCast-AI\refactorPages.js"
    echo        DELETED: refactorPages.js
) else ( echo        SKIPPED )

echo [5/12] Deleting RestoreOldDesign.js...
if exist "C:\NetCast-AI\RestoreOldDesign.js" (
    del /f /q "C:\NetCast-AI\RestoreOldDesign.js"
    echo        DELETED: RestoreOldDesign.js
) else ( echo        SKIPPED )

echo [6/12] Deleting updateDashboardReal.js...
if exist "C:\NetCast-AI\updateDashboardReal.js" (
    del /f /q "C:\NetCast-AI\updateDashboardReal.js"
    echo        DELETED: updateDashboardReal.js
) else ( echo        SKIPPED )

:: Delete bat scripts
echo [7/12] Deleting Apply-Features.bat...
if exist "C:\NetCast-AI\Apply-Features.bat" (
    del /f /q "C:\NetCast-AI\Apply-Features.bat"
    echo        DELETED: Apply-Features.bat
) else ( echo        SKIPPED )

echo [8/12] Deleting Apply-RealServices.bat...
if exist "C:\NetCast-AI\Apply-RealServices.bat" (
    del /f /q "C:\NetCast-AI\Apply-RealServices.bat"
    echo        DELETED: Apply-RealServices.bat
) else ( echo        SKIPPED )

echo [9/12] Deleting Apply-Refactor.bat...
if exist "C:\NetCast-AI\Apply-Refactor.bat" (
    del /f /q "C:\NetCast-AI\Apply-Refactor.bat"
    echo        DELETED: Apply-Refactor.bat
) else ( echo        SKIPPED )

echo [10/12] Deleting Download-Old-Repo.bat...
if exist "C:\NetCast-AI\Download-Old-Repo.bat" (
    del /f /q "C:\NetCast-AI\Download-Old-Repo.bat"
    echo        DELETED: Download-Old-Repo.bat
) else ( echo        SKIPPED )

echo [11/12] Deleting Run-Restore-Old-Design.bat...
if exist "C:\NetCast-AI\Run-Restore-Old-Design.bat" (
    del /f /q "C:\NetCast-AI\Run-Restore-Old-Design.bat"
    echo        DELETED: Run-Restore-Old-Design.bat
) else ( echo        SKIPPED )

echo [12/12] Deleting Setup-FullProject.bat...
if exist "C:\NetCast-AI\Setup-FullProject.bat" (
    del /f /q "C:\NetCast-AI\Setup-FullProject.bat"
    echo        DELETED: Setup-FullProject.bat
) else ( echo        SKIPPED )

:: Delete this cleanup bat itself
echo.
echo ============================================
echo   Cleanup COMPLETE! All unwanted files
echo   have been removed successfully.
echo ============================================
echo.
echo   Remaining clean files:
echo   - netcast-ai (folder)
echo   - netcast-node-backend (folder)
echo   - NetCast-AI-Launcher.bat
echo   - Build-Mobile-App.bat
echo   - Build-For-Web.bat
echo   - Deploy-To-Vercel.bat
echo   - Start-Website.bat
echo ============================================
echo.
echo This cleanup file will now self-delete...
timeout /t 3 /nobreak >nul
del /f /q "%~f0"
