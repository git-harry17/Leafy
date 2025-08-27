import { getAuth } from "firebase-admin/auth";
import logger from '../utils/logger.js';

let firebaseInitialized = false;

// Initialize Firebase Admin (if credentials are available)
const initializeFirebase = () => {
    if (firebaseInitialized) return;
    
    try {
        // Only initialize if Firebase config is available
        if (process.env.FIREBASE_CONFIG) {
            const admin = require("firebase-admin");
            const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
            
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            
            firebaseInitialized = true;
            logger.info('Firebase Admin initialized successfully');
        }
    } catch (error) {
        logger.error('Failed to initialize Firebase Admin:', error);
    }
};

export const verifyGoogleToken = async (accessToken) => {
    try {
        initializeFirebase();
        
        if (!firebaseInitialized) {
            throw new Error('Firebase not initialized');
        }
        
        const decodedUser = await getAuth().verifyIdToken(accessToken);
        return decodedUser;
    } catch (error) {
        logger.error('Google token verification failed:', error);
        return null;
    }
};