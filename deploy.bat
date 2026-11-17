@echo off
setlocal enableextensions enabledelayedexpansion

:: Add Git and Node to PATH
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   STAFFPOINT - AUTO DEPLOY & VERSION BUMP
echo   Link Vercel: https://ncttx-staffpoint.vercel.app/
echo   Link GitHub: https://fongshubvn-cyber.github.io/ncttx-staffpoint/
echo ========================================================
echo.

set "msg=%~1"
if "%msg%"=="" (
    set "msg=Update website %date% %time%"
)

node scripts\auto_deploy.cjs "%msg%"

pause
