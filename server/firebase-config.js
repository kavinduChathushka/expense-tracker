const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let db;

try {
  // Check if we're in production (using environment variables)
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_PROJECT_ID) {
    // Production: Use environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized for production');
  } else {
    // Development: Try to use service account file
    const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
    
    if (require('fs').existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin SDK initialized for development');
    } else {
      // Fallback: Use application default credentials
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log('✅ Firebase Admin SDK initialized with default credentials');
    }
  }
  
  db = admin.firestore();
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  process.exit(1);
}

module.exports = { db, admin };
