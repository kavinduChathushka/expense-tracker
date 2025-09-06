// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTGbCHyJL3Uinh9goRE_FeiwqCXG2Ds6o",
  authDomain: "jrc-expense-tracking.firebaseapp.com",
  projectId: "jrc-expense-tracking",
  storageBucket: "jrc-expense-tracking.firebasestorage.app",
  messagingSenderId: "164028085148",
  appId: "1:164028085148:web:1ed4ab37c23cf276aece59",
  measurementId: "G-WVH51CEHD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in production)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, analytics, db };
export default app;
