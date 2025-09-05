@echo off
echo 🚀 Starting cloud deployment process...

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git not initialized. Please run:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    echo    git remote add origin ^<your-github-repo-url^>
    echo    git push -u origin main
    pause
    exit /b 1
)

REM Check if all changes are committed
git status --porcelain > temp_status.txt
if %errorlevel% neq 0 (
    echo ❌ Git status check failed
    pause
    exit /b 1
)

for /f %%i in (temp_status.txt) do (
    echo 📝 Uncommitted changes detected. Committing them...
    git add .
    git commit -m "Prepare for cloud deployment - %date% %time%"
    goto :push
)

:push
del temp_status.txt 2>nul

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo 🌐 Next steps for deployment:
echo.
echo 1️⃣  Deploy Backend to Railway:
echo    • Go to https://railway.app
echo    • Sign up with GitHub
echo    • Click 'New Project' → 'Deploy from GitHub repo'
echo    • Select your repository
echo    • Set Root Directory to 'server'
echo    • Add environment variables:
echo      - MONGODB_URI=mongodb+srv://jrc-expense:jrc-expense@cluster0.19efwnx.mongodb.net/?retryWrites=true^&w=majority^&appName=Cluster0
echo      - NODE_ENV=production
echo      - PORT=5000
echo.
echo 2️⃣  Deploy Frontend to Vercel:
echo    • Go to https://vercel.com
echo    • Sign up with GitHub
echo    • Click 'New Project' → Import your repository
echo    • Set Root Directory to 'client'
echo    • Add environment variable:
echo      - REACT_APP_API_URL=https://your-railway-backend-url.railway.app
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo.
echo 🎉 Your app will be live in minutes!
pause
