# 🚀 Local Startup Guide

## Quick Start Commands

### Start Backend Server
```bash
cd server
npm install
npm run dev
```

### Start Frontend (in new terminal)
```bash
cd client
npm install
npm start
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📊 Current Status

✅ **Backend Server**: Running on port 5000  
✅ **Frontend**: Running on port 3000  
✅ **Firebase**: Connected to Firestore  
✅ **Database**: expense-track-jrc project  

## 🧪 Test Your Application

1. **Open Browser**: Go to http://localhost:3000
2. **Test Features**:
   - View existing expenses
   - Add new expenses with file uploads
   - View dashboard with totals
   - Filter by categories and months
   - Delete expenses

## 🔧 Available Scripts

### Backend (server/)
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm install` - Install dependencies

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm install` - Install dependencies

## 🛠️ Troubleshooting

### Server won't start
- Check if port 5000 is available
- Run `npm install` in server directory
- Check Firebase service account file exists

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` in client directory
- Check if backend is running on port 5000

### Database connection issues
- Verify `firebase-service-account.json` exists in server folder
- Check Firebase project ID matches
- Ensure Firestore is enabled in Firebase Console

## 📱 Mobile Testing

Your app is responsive! Test on mobile by:
1. Find your computer's IP address
2. Access http://YOUR_IP:3000 from mobile device
3. Make sure both devices are on same network

## 🔥 Firebase Console

Monitor your data at: https://console.firebase.google.com/project/expense-track-jrc

---

**Happy coding! 🎉**
