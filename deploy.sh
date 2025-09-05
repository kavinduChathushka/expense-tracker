#!/bin/bash

# Deployment script for Expense Tracker
echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f "server/config.env" ]; then
    echo "❌ Error: server/config.env file not found!"
    echo "Please create the file with your MongoDB URI and other environment variables."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build client
echo "🏗️ Building client..."
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Client build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Your application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Set up MongoDB Atlas (see DEPLOYMENT.md)"
echo "2. Choose a deployment platform:"
echo "   - Vercel + Railway (Recommended)"
echo "   - Vercel + Render"
echo "   - Full stack on Vercel"
echo "   - Docker deployment"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
