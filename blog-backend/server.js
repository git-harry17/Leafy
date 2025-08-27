// server.js - Main application entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import { loadEnvConfig } from './config/env.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSecurity } from './middleware/security.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

// Load environment configuration
loadEnvConfig();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
setupSecurity(app);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://leafy-two-sigma.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api', healthRoutes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDatabase();
        
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
            logger.info(`CORS enabled for: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

startServer();