@echo off
REM ZeroTrace Font Downloader for Windows
REM Run this in the zerotrace-backend directory

echo ==========================================
echo ZeroTrace Font Downloader
echo ==========================================
echo.

set FONTS_DIR=public\assets\fonts
if not exist "%FONTS_DIR%" mkdir "%FONTS_DIR%"

echo [1/3] Downloading Liberation Sans Bold...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/shantigilbert/liberation-fonts-ttf/raw/master/LiberationSans-Bold.ttf' -OutFile '%FONTS_DIR%\Arial-bold.ttf'"

echo.
echo [2/3] Downloading Montserrat SemiBold...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-SemiBold.ttf' -OutFile '%FONTS_DIR%\Montserrat-SemiBold.ttf'"

echo.
echo [3/3] Downloading Font Awesome 5 Free Solid...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/FortAwesome/Font-Awesome/raw/5.x/webfonts/fa-solid-900.ttf' -OutFile '%FONTS_DIR%\zt-icons.ttf'"

echo.
echo ==========================================
echo Download complete! Verifying files...
echo ==========================================
echo.

dir "%FONTS_DIR%"

echo.
echo Expected sizes:
echo   Arial-bold.ttf         ~130KB
echo   Montserrat-SemiBold.ttf ~200KB
echo   zt-icons.ttf            ~400KB
echo.
pause
