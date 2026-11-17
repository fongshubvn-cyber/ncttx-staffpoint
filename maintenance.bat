@echo off
setlocal enableextensions enabledelayedexpansion

:: Add Git and Node to PATH
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   KICH HOAT CHE DO BAO TRI & TU DONG XOA CACHE
echo   He Thong: Staffpoint - Nha Cua Thoi Thanh Xuan
echo   Link: https://fongshubvn-cyber.github.io/ncttx-staffpoint/
echo ========================================================
echo.
echo [1/2] Dang chuan bi trang bao tri thong minh...
echo       - Tu dong xoa Service Worker tren may nguoi dung
echo       - Tu dong xoa sach CacheStorage cua PWA
echo       - Tu dong kiem tra va chuyen ve app khi deploy xong
echo.

echo [2/2] Dang upload trang Bao Tri len GitHub Pages...
call npx.cmd gh-pages -d maintenance

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Upload trang bao tri that bai. Vui long kiem tra ket noi mang.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   DA KICH HOAT CHE DO BAO TRI THANH CONG!
echo.
echo   * Nguoi dung truy cap se thay thong bao Bao Tri am cung.
echo   * Moi thiet bi bi ket cache cu se tu dong duoc don sach.
echo   * Code tren nhanh 'main' va du lieu Firebase KHONG bi anh huong!
echo.
echo   KHI HOAN TAT:
echo   Ban chi can chay file 'deploy.bat' de dua app tro lai.
echo   Moi may dang xem trang bao tri se tu dong nạp app moi!
echo ========================================================
echo.
pause
