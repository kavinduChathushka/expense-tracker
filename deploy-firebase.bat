@echo off
echo 🚀 Starting Firebase Deployment...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

REM Login to Firebase (if not already logged in)
echo 🔐 Checking Firebase authentication...
firebase login --no-localhost

REM Set the correct project
echo 📁 Setting Firebase project...
firebase use jrc-expense-tracking

REM Build the frontend
echo 🏗️ Building frontend for production...
cd client
call npm run build
cd ..

REM Deploy Firestore rules
echo 🔥 Deploying Firestore rules...
firebase deploy --only firestore:rules

REM Deploy to Firebase Hosting
echo 🌐 Deploying to Firebase Hosting...
firebase deploy --only hosting

echo ✅ Deployment complete!
echo 🌐 Your app is now live at: https://jrc-expense-tracking.web.app
echo.
echo 📋 Next steps:
echo 1. Deploy your backend to Render/Railway
echo 2. Update REACT_APP_API_URL in Firebase Hosting environment variables
echo 3. Test your deployed application

pause
