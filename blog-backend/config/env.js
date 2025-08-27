import dotenv from 'dotenv';
import logger from '../utils/logger.js';

export const loadEnvConfig = () => {
    dotenv.config();
    
    const requiredVars = [
        'DB_LOCATION',
        'SECRET_ACCESS_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    // Set default values
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT = process.env.PORT || '3000';
    process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'https://leafy-two-sigma.vercel.app';
    
    logger.info('✅ Environment configuration loaded');
};

export const getConfig = () => ({
    port: process.env.PORT,
    dbLocation: process.env.DB_LOCATION,
    secretKey: process.env.SECRET_ACCESS_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
    firebaseConfig: process.env.FIREBASE_CONFIG
});