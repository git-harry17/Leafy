import express from 'express';
import { healthCheck, readinessCheck } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Basic health check endpoint
 * @access  Public
 */
router.get('/health', healthCheck);

/**
 * @route   GET /api/ready
 * @desc    Readiness probe for deployment
 * @access  Public
 */
router.get('/ready', readinessCheck);

export default router;