@echo off
echo 🚀 Deploying Fixed Expense Tracker to Firebase
echo ================================================

echo.
echo 📦 Building frontend...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend built successfully!

echo.
echo 🔥 Deploying frontend to Firebase Hosting...
cd ..
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Firebase hosting deployment failed!
    pause
    exit /b 1
)
echo ✅ Frontend deployed to Firebase Hosting!

echo.
echo 📋 Deploying Firestore rules...
call firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo ❌ Firestore rules deployment failed!
    pause
    exit /b 1
)
echo ✅ Firestore rules deployed!

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📱 Frontend URL: https://jrc-expense-tracking.web.app
echo 🔧 Backend needs to be deployed to Render/Railway separately
echo.
echo Next steps:
echo 1. Deploy backend to Render: https://render.com
echo 2. Update REACT_APP_API_URL in Firebase Hosting environment variables
echo 3. Test the application
echo.
pause
