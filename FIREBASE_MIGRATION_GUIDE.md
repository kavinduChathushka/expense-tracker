# 🔥 Firebase Firestore Migration Guide

## 🎯 Why Firebase Firestore?

✅ **Free Tier**: 1GB storage, 50K reads, 20K writes per day  
✅ **No Credit Card Required**  
✅ **Real-time Database**  
✅ **Automatic Scaling**  
✅ **Built-in Security Rules**  
✅ **Easy Integration with Google Services**  

## 📋 Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Enter project name**: `expense-tracker-app`
4. **Enable Google Analytics** (optional)
5. **Click "Create project"**

## 🗄️ Step 2: Set up Firestore Database

1. **In Firebase Console, click "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll secure it later)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

## 🔑 Step 3: Get Firebase Configuration

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Click "Web app" icon** (`</>`)
4. **Register app name**: `expense-tracker-backend`
5. **Copy the config object** (we'll use this)

## 🔧 Step 4: Install Firebase SDK

```bash
cd server
npm install firebase-admin
```

## 📝 Step 5: Firebase Service Account

1. **Go to Project Settings → Service Accounts**
2. **Click "Generate new private key"**
3. **Download the JSON file**
4. **Rename it to `firebase-service-account.json`**
5. **Place it in your `server` folder**

## 🚀 Step 6: Update Your Backend

I'll create the Firebase configuration files for you!

---

## 🔒 Security Rules (Optional but Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to expenses collection
    match /expenses/{document} {
      allow read, write: if true; // For now, we'll secure this later
    }
  }
}
```

## 📊 Firestore vs MongoDB Comparison

| Feature | MongoDB | Firestore |
|---------|---------|-----------|
| **Free Tier** | 512MB | 1GB |
| **Reads/Day** | Unlimited | 50K |
| **Writes/Day** | Unlimited | 20K |
| **Real-time** | ❌ | ✅ |
| **Offline Support** | ❌ | ✅ |
| **Security Rules** | Manual | Built-in |
| **Scaling** | Manual | Automatic |

## 🎉 Benefits of Migration

1. **No Database Server Management**
2. **Automatic Backups**
3. **Real-time Updates**
4. **Better Security**
5. **Easier Deployment**
6. **Google Cloud Integration**

---

**Ready to migrate?** Let me create the Firebase configuration files for you!
