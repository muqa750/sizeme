@echo off
title SizeMe Deploy
cd /d "%~dp0"

SET GIT=git

echo.
echo ================================
echo  SizeMe - Deploy to GitHub
echo ================================
echo.

:: Check for local changes
FOR /F %%i IN ('git status --porcelain') DO SET CHANGES=%%i

IF DEFINED CHANGES (
    echo --- Changed Files ---
    %GIT% status --short
    echo.

    set /p COMMIT_MSG=Commit message (press Enter for "update"):
    if "%COMMIT_MSG%"=="" set COMMIT_MSG=update

    echo.
    %GIT% add .
    if %errorlevel% neq 0 ( echo ERROR: git add failed & PAUSE & exit /b 1 )

    %GIT% commit -m "%COMMIT_MSG%"
    if %errorlevel% neq 0 ( echo ERROR: git commit failed & PAUSE & exit /b 1 )
) ELSE (
    echo No new changes to commit.
    echo Checking for unpushed commits...
    echo.
)

:: Push whatever is ready
echo Uploading to GitHub...
%GIT% push origin main
if %errorlevel% neq 0 ( echo ERROR: git push failed & PAUSE & exit /b 1 )

echo.
echo ================================
echo  Done! Netlify updating now...
echo ================================
echo.
PAUSE
