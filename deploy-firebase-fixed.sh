#!/bin/bash

echo "🚀 Deploying Fixed Expense Tracker to Firebase"
echo "================================================"

echo ""
echo "📦 Building frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend built successfully!"

echo ""
echo "🔥 Deploying frontend to Firebase Hosting..."
cd ..
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Firebase hosting deployment failed!"
    exit 1
fi
echo "✅ Frontend deployed to Firebase Hosting!"

echo ""
echo "📋 Deploying Firestore rules..."
firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
    echo "❌ Firestore rules deployment failed!"
    exit 1
fi
echo "✅ Firestore rules deployed!"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Frontend URL: https://jrc-expense-tracking.web.app"
echo "🔧 Backend needs to be deployed to Render/Railway separately"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render: https://render.com"
echo "2. Update REACT_APP_API_URL in Firebase Hosting environment variables"
echo "3. Test the application"
echo ""
