# 🔥 Firebase Setup Instructions

## 🎯 Quick Setup Guide

Follow these steps to migrate from MongoDB to Firebase Firestore:

### Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Enter project name**: `expense-tracker-app`
4. **Enable Google Analytics**: Optional
5. **Click "Create project"**

### Step 2: Set up Firestore Database

1. **In Firebase Console, click "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll secure it later)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

### Step 3: Get Service Account Key

1. **Go to Project Settings** (gear icon)
2. **Click "Service accounts" tab**
3. **Click "Generate new private key"**
4. **Download the JSON file**
5. **Rename it to `firebase-service-account.json`**
6. **Place it in your `server` folder**

### Step 4: Install Dependencies

```bash
cd server
npm install firebase-admin
```

### Step 5: Test Locally

```bash
cd server
npm run dev
```

You should see: `🔥 Connected to Firebase Firestore`

### Step 6: Deploy to Cloud

Your existing deployment configurations will work with Firebase!

## 🔧 Environment Variables for Production

For cloud deployment, set these environment variables:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

## 🔒 Security Rules (Optional)

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{document} {
      allow read, write: if true; // For now, secure this later
    }
  }
}
```

## 📊 Firebase vs MongoDB Comparison

| Feature | MongoDB Atlas | Firebase Firestore |
|---------|---------------|-------------------|
| **Free Tier** | 512MB | 1GB |
| **Reads/Day** | Unlimited | 50K |
| **Writes/Day** | Unlimited | 20K |
| **Real-time** | ❌ | ✅ |
| **Offline Support** | ❌ | ✅ |
| **Security Rules** | Manual | Built-in |
| **Scaling** | Manual | Automatic |
| **Backups** | Manual | Automatic |

## 🎉 Benefits of Firebase

1. **No Database Server Management**
2. **Automatic Backups**
3. **Real-time Updates**
4. **Better Security**
5. **Easier Deployment**
6. **Google Cloud Integration**
7. **No Credit Card Required**

## 🚀 Deployment Options

### Option 1: Render (Recommended)
- **Free Tier**: 750 hours/month
- **No Credit Card Required**
- **Automatic deployments**

### Option 2: Railway
- **Free Tier**: $5 credit/month
- **Requires Credit Card**
- **Very fast deployments**

### Option 3: Vercel (Serverless)
- **Free Tier**: Generous limits
- **No Credit Card Required**
- **Serverless functions**

## 🔍 Troubleshooting

### Firebase connection fails
- Check if `firebase-service-account.json` is in the correct location
- Verify the service account has proper permissions
- Check Firebase project ID is correct

### Environment variables not working
- Make sure all Firebase environment variables are set
- Check for proper formatting of private key
- Verify project ID matches your Firebase project

### Firestore rules blocking requests
- Check Firestore security rules
- Make sure rules allow read/write operations
- Test with Firebase Console

## 📱 Testing Your App

1. **Start your backend**: `cd server && npm run dev`
2. **Start your frontend**: `cd client && npm start`
3. **Test all features**:
   - Add expenses
   - View dashboard
   - Upload files
   - Delete expenses

## 🎯 Next Steps

1. **Set up Firebase project**
2. **Download service account key**
3. **Install Firebase dependencies**
4. **Test locally**
5. **Deploy to cloud**
6. **Update frontend environment variables**

---

**Need help?** Check the Firebase documentation or refer to the error logs in your console.
