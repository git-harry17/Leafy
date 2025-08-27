import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/errorHandler.js';

export const healthCheck = asyncHandler(async (req, res) => {
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    };

    // Check database connectivity
    if (mongoose.connection.readyState !== 1) {
        health.status = 'ERROR';
        return res.status(503).json(health);
    }

    res.status(200).json(health);
});

export const readinessCheck = asyncHandler(async (req, res) => {
    // Perform more thorough checks here
    const checks = {
        database: false,
        memory: false
    };

    // Database check
    try {
        await mongoose.connection.db.admin().ping();
        checks.database = true;
    } catch (error) {
        checks.database = false;
    }

    // Memory check (ensure we're not using too much memory)
    const memoryUsage = process.memoryUsage();
    checks.memory = memoryUsage.heapUsed < 512 * 1024 * 1024; // Less than 512MB

    const isReady = Object.values(checks).every(check => check === true);

    res.status(isReady ? 200 : 503).json({
        ready: isReady,
        checks,
        timestamp: new Date().toISOString()
    });
});