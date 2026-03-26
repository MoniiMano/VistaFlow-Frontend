@echo off
REM VistaFlow Installation Script for Windows
REM This script automates the setup process

echo.
echo ========================================
echo   VistaFlow Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected
node -v

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [OK] npm detected
npm -v

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB is not detected
    echo You can:
    echo   1. Install MongoDB locally from https://www.mongodb.com/try/download/community
    echo   2. Use MongoDB Atlas (cloud) - we'll configure this later
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    echo [OK] MongoDB detected
)

echo.
echo Installing dependencies...
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend installation failed
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

echo.
echo Setting up environment files...
echo.

REM Setup frontend .env
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Frontend .env created
) else (
    echo [WARNING] Frontend .env already exists, skipping
)

REM Setup backend .env
if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
    echo [OK] Backend .env created
) else (
    echo [WARNING] Backend .env already exists, skipping
)

echo.
echo ========================================
echo   Installation complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB:
echo    mongod
echo.
echo 2. Start the backend (in a new terminal):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the frontend (in another terminal):
echo    npm run dev
echo.
echo 4. Open your browser:
echo    http://localhost:3000
echo.
echo For detailed instructions, see:
echo    - QUICK_START.md
echo    - SETUP_GUIDE.md
echo.
echo Happy coding!
echo.
pause
