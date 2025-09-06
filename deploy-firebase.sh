#!/bin/bash

# Firebase Deployment Script
echo "🚀 Starting Firebase Deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase authentication..."
firebase login --no-localhost

# Set the correct project
echo "📁 Setting Firebase project..."
firebase use expense-track-jrc

# Build the frontend
echo "🏗️ Building frontend for production..."
cd client
npm run build
cd ..

# Deploy Firestore rules
echo "🔥 Deploying Firestore rules..."
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at: https://expense-track-jrc.web.app"
echo ""
echo "📋 Next steps:"
echo "1. Deploy your backend to Render/Railway"
echo "2. Update REACT_APP_API_URL in Firebase Hosting environment variables"
echo "3. Test your deployed application"
