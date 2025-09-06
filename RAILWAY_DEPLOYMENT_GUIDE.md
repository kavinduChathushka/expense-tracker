# 🚀 Railway Deployment Guide - Free Backend Hosting

## 🎯 Why Railway?
- ✅ **$5 free credit monthly** (generous for small apps)
- ✅ **No code changes needed** - works with your current Express.js setup
- ✅ **File upload support** - perfect for payslip uploads
- ✅ **Automatic HTTPS** - secure connections
- ✅ **Easy environment variables** - simple configuration
- ✅ **Fast deployment** - live in 2-3 minutes

## 📋 Step-by-Step Deployment

### Step 1: Go to Railway
1. **Visit**: [https://railway.app](https://railway.app)
2. **Click "Start a New Project"**
3. **Sign up with GitHub** (recommended)

### Step 2: Deploy from GitHub
1. **Click "Deploy from GitHub repo"**
2. **Select your expense-tracker repository**
3. **Click "Deploy Now"**

### Step 3: Configure the Service
1. **Click on your deployed service**
2. **Go to "Settings" tab**
3. **Set Root Directory**: `server`
4. **Click "Save"**

### Step 4: Add Environment Variables
1. **Go to "Variables" tab**
2. **Add each environment variable**:

```bash
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=jrc-expense-tracking
FIREBASE_PRIVATE_KEY_ID=be73c9e4c7f9ff7987deb217b05621cf7bb67960
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCstA3+HYf1Wf/R\nSv45D+dNIEc9K1q26PQX2cAwhq+TN3pW/+vm9KbnkU4auNc4MJci9NHVKENSL6Q2\nOmdvsIn8Qr1jLOZRLUqiUxwQ0QSJx0s2a1VDH5gqfTKz2HxEegkQY2VFbCo/s8Fq\nMXpMzSbCm/EMdpCQWbkWgM5HckwTAyyZXWOkMo1Jg+2a8LVUP7Z60HFdsZAj0eIm\nBhSwYq74EMDKS0AjDQAz5c/+15/bReN2rzkFl5vtxiYbfE9S6RlZrxwbxuxlSer5\n4j8eSpSpySxAof1YRolBoNuzhvQnKz9pOONVJh+ga3xC07o2Igkz4MuH4H5HHeHE\nSNg8n3ePAgMBAAECggEACpSRUuMeRDK6UGkmv/owcnIqyx2P1irZYWiutIpb0UoR\nzaiqHCEa5I7rWQm/7apUaAjVnhh0X2GZztSvJ5GKMpEoJx5GEe0TaHRtAL69Z291\nNSVIOO+Dk/7Nj2UQ3+UWDxH3z1P8FqD9lXLoijH7UOrazqeo3Z8RjsZfXNMsw/FQ\n8y9tpVssalsoS6r+J4WBRq11+CcqkJk7hH4jJoWmLPRiwbBmkxAgDAWih/gLDB4D\nZS/946ly4Cp0TUTZ/lCwmDvRgwhYbdsi37NUqnZNncDGjJgcP6t4EYj8XvYWEH6p\nGiY8YPrU6A9n+q/VSYzi4dT7etiNjdkoEBgzuJLw+QKBgQDoM8ZEhQzkF37soiuh\n6dTA81gKt/L3szdQIYloY2AORhRPsI62129vHuiRnDkL0oiz9Equ1Q7hLLq1ycUk\nnbtvA3roBq7sWQeDE0lT3vpzjK2aAJUxsBa7LfQuuXSv3cOtoa2jXNgoi6vK+JJi\nco5BXjEDO1yoMfCpPVMd4EarxQKBgQC+ZzlXDcB8qBF1mgC0H8aIW9/oTEeCEySr\nSMwDrMq6iy8FyUKb0fqWPLuI4hrIkBl6iwofOIviHn9DMbKfgc6q2gj9YpKE6ao5\nz+KqvAgCworQlbPb7hYwllEvTrd4Nv7FsWW5jFgL8BD8NAPAXwPoj+CKJJk8AsSo\nmlOIMfenQwKBgQCZ2OP+tiDqZ17jLje2mZUrGpA02dgTohx97Rp7nYwhKPGAMzz7\njBX7DAGPqHBrktycTrnEyMmJC/fRRpRmRFPRo/6lCPiRBBPkFr044r4SHR1Qsh4n\nw8Hr1vC4nIvhkg96VWsUmAloI9J5MuTacYgra1sSBxzHG/+WQll1rAlm+QKBgASF\nRuM+PFe5VdDI+0NLjdcm90X4qan48mHutIlRzO5o55DnmmFAtwZiIsG5PJGOekxi\niLb9DLUtrC/YOjl3R4Te8F+zu27UbWo5+VO8ayRFoi4Zn8+U84nrx7mr0MdV5u6i\nq5ugLWb7KCwUwBINL3aSE+6zt7+pASpPn7QYG50pAoGBAOUS3JorlVlmGcWOyWNV\nXsNqNOYx8vPyicrz1y/O9iWF2nmei6UKlEDpsuJGl11vfuG1I4YVjV/fV01boGCS\nePJWsCRj19ItCLeNUiQNCBBpCiXPn0wJ4S81GRp4lcYsPWMPtBs8iYSBhgre13aT\n8yI6TgqKVbfpxSN+543uRmD+\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@expense-track-jrc.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=109194256016806302266
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### Step 5: Get Your Backend URL
1. **Go to "Deployments" tab**
2. **Copy the URL** (e.g., `https://expense-tracker-backend-production.up.railway.app`)
3. **Test the health endpoint**: `https://your-url.railway.app/health`

### Step 6: Update Frontend Configuration
1. **Go to Firebase Console** → **Hosting**
2. **Click on your deployed site**
3. **Go to Settings** → **Environment Variables**
4. **Add**:
   ```bash
   REACT_APP_API_URL=https://your-railway-url.railway.app
   ```

### Step 7: Redeploy Frontend
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

## 🧪 Testing Your Deployment

### Test Backend
- **Health Check**: `https://your-url.railway.app/health`
- **API Endpoint**: `https://your-url.railway.app/api/expenses`

### Test Frontend
- **Visit**: https://jrc-expense-tracking.web.app
- **Test**: Upload expenses, view dashboard, delete expenses

## 🔍 Troubleshooting

### Backend Issues
- **Check Railway logs**: Go to your service → "Deployments" → Click on latest deployment → "View Logs"
- **Verify environment variables**: Ensure all Firebase credentials are set
- **Check root directory**: Must be set to `server`

### Frontend Issues
- **Check browser console**: Look for network errors
- **Verify API URL**: Ensure `REACT_APP_API_URL` is set correctly
- **Check CORS**: Backend should allow requests from Firebase Hosting

## 📊 Expected Results

After successful deployment:
- ✅ **Frontend**: https://jrc-expense-tracking.web.app
- ✅ **Backend**: https://your-url.railway.app
- ✅ **Database**: Firebase Firestore working properly
- ✅ **File Uploads**: Working without errors
- ✅ **Expense Tracking**: Full functionality restored

## 🎉 Success Indicators

1. **No more "Error uploading expense" messages**
2. **Expenses appear in the dashboard after upload**
3. **Files are uploaded and accessible**
4. **All CRUD operations work properly**
5. **No console errors in browser or backend logs**

---

**Ready to deploy to Railway? Follow the steps above! 🚀**
