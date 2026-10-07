@echo off
setlocal enableextensions enabledelayedexpansion

:: Add Git and Node to PATH
set "PATH=C:\Program Files\Git\cmd;%PATH%"

echo ========================================================
echo   STAFFPOINT v1.005 - DEPLOY TO GITHUB PAGES
echo   Link: https://fongshubvn-cyber.github.io/ncttx-staffpoint/
echo ========================================================
echo.

echo [1/3] Building production bundle (v1.005)...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed. Please fix errors before deploying.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Pushing source code to GitHub main branch...
git add .
set "msg=%~1"
if "%msg%"=="" (
    set "msg=Release v1.005-stable %date% %time%"
)
git commit -m "%msg%"
git push origin main

echo.
echo [3/3] Uploading site to GitHub Pages (gh-pages branch)...
call npm.cmd run deploy

echo.
echo ========================================================
echo SUCCESS: Deployed v1.005 successfully!
echo Link: https://fongshubvn-cyber.github.io/ncttx-staffpoint/
echo (Note: GitHub Pages may take 1-2 minutes to reflect updates)
echo ========================================================
echo.
pause
