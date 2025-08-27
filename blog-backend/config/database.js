import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let isConnected = false;

export const connectDatabase = async () => {
    if (isConnected) {
        logger.info('Database already connected');
        return;
    }

    try {
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        };

        await mongoose.connect(process.env.DB_LOCATION, options);
        isConnected = true;
        
        logger.info(' Database connected successfully');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('Database connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Database disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('Database reconnected');
            isConnected = true;
        });

    } catch (error) {
        logger.error('Database connection failed:', error);
        isConnected = false;
        throw error;
    }
};

export const disconnectDatabase = async () => {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
        logger.info('Database disconnected');
    }
};