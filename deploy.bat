@echo off
title SizeMe Deploy
cd /d "%~dp0"

echo.
echo ================================
echo  SizeMe - Deploy to GitHub
echo ================================
echo.

:: Search for Git in all common locations
SET GIT=""

IF EXIST "C:\Program Files\Git\cmd\git.exe"       SET GIT="C:\Program Files\Git\cmd\git.exe"
IF EXIST "C:\Program Files (x86)\Git\cmd\git.exe" SET GIT="C:\Program Files (x86)\Git\cmd\git.exe"
IF EXIST "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" SET GIT="%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
IF EXIST "%USERPROFILE%\AppData\Local\Programs\Git\cmd\git.exe" SET GIT="%USERPROFILE%\AppData\Local\Programs\Git\cmd\git.exe"

:: Try PATH as last option
IF %GIT%=="" (
    where git >nul 2>&1
    IF %errorlevel%==0 SET GIT=git
)

IF %GIT%=="" (
    echo ERROR: Git not found on this computer.
    echo Please reinstall Git from: https://git-scm.com
    echo During install, choose "Add Git to PATH"
    echo.
    PAUSE
    exit /b 1
)

echo Git found: %GIT%
echo.

echo --- Changed Files ---
%GIT% status --short
echo.

set /p COMMIT_MSG=Commit message (press Enter for "update"):
if "%COMMIT_MSG%"=="" set COMMIT_MSG=update

echo.
echo Uploading...
echo.

%GIT% add .
if %errorlevel% neq 0 ( echo ERROR: git add failed & PAUSE & exit /b 1 )

%GIT% commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 ( echo ERROR: git commit failed & PAUSE & exit /b 1 )

%GIT% push origin main
if %errorlevel% neq 0 ( echo ERROR: git push failed & PAUSE & exit /b 1 )

echo.
echo ================================
echo  Done! Netlify updating now...
echo ================================
echo.
PAUSE
